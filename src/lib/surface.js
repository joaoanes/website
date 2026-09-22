import { createProgram } from './gl'

// The ocean, seen from where the water meets the sand.
//
// Two things make that view work and neither is a flat square of mesh. First the grid is
// *projected*: rows march away from the eye on a harmonic curve and each row is as wide
// as the frustum is at that depth, so a fixed vertex budget covers everything from your
// feet to the horizon instead of running out at a visible far edge. Second there is a
// seabed — the shoreline is not drawn anywhere, it is just where the water depth crosses
// zero, and a single swell line runs in over that bed, growing as the bottom rises under
// it. Everything you can read about the shape of the ground comes from what the water
// does on its way in.
//
// The wireframe is derived in the fragment shader from world position in metres — not
// from the mesh parameter, which would make it a screen-space grid, and not from
// camera-relative metres, which would make the water turn to face you. One draw call, no
// second index buffer, and the cell size steps up by powers of two as cells stop being
// resolvable so the grid survives all the way to the horizon.

const SURFACE_VERT = `
attribute vec2 aGrid;

uniform mat4 uMVP;
uniform sampler2D uHeight;

uniform float uNear;
uniform float uFar;
uniform float uSpread;
uniform float uNearHalfWidth;
uniform float uRows;

uniform float uSwell;
uniform float uSlow;
uniform float uChop;

uniform vec4 uSimBox;
uniform float uAmplitude;
uniform float uFogDensity;

uniform vec2 uForward;
uniform vec2 uRight;
uniform vec2 uEye;

uniform float uShoreDepth;
uniform float uShoreBlend;
uniform float uShoreCurve;
uniform vec3 uHeadland;
uniform float uBeachSlope;
uniform vec3 uBar;
uniform float uDepthRef;
uniform float uShoalMax;
uniform float uShoalPower;
uniform float uWaveStart;
uniform float uWaveWidth;
uniform float uWaveHeight;
uniform float uWaveCycle;
uniform float uWaveRunout;
uniform float uBreakerIndex;
uniform float uSwash;

varying vec2 vMetres;
varying float vHeight;
varying float vFog;
varying float vShore;
varying float vShallow;

// The coast itself, with no water on it. Kept separate from the moving waterline below,
// because the wave train has to be positioned against something that does not move: it
// was positioned against a shifting waterline once before and the crest visibly slid
// backwards down the beach whenever the water drew back. This also replaced an earlier
// free-running "surge" term that oscillated the waterline on its own timer; the swash
// below does the same job, phase-locked to the wave that causes it.
float coastAt(float x) {
  float curve = sin(x * 0.055 + 0.9) * 2.4 + sin(x * 0.131 - 2.1) * 0.85;
  // A headland: one stretch of coast standing further out than the rest, so the
  // waterline sweeps away from the viewer there instead of running flat across.
  float headland = uHeadland.x * exp(-pow((x - uHeadland.y) / uHeadland.z, 2.0));
  return uShoreDepth + curve * uShoreCurve + headland;
}

// Where the water's edge actually is right now. uSwash is the sheet the broken bore
// throws up the sand, so the waterline runs up the beach and drains back with every wave.
float shoreline(float x) {
  return coastAt(x) - uSwash;
}

// Depth of water over the seabed. This is what the whole scene is really about: the
// shoreline is not drawn, it is simply where this crosses zero, and everything the water
// does differently in the shallows is what lets you read the shape of the ground under
// it. The sandbar is a ridge running parallel to the coast — the swell rears up crossing
// it and settles again in the deeper trough behind, which is the clearest tell there is
// that something is down there.
float depthAt(vec2 p) {
  float seaward = p.y - shoreline(p.x);
  float bar = uBar.x * exp(-pow((seaward - uBar.y) / uBar.z, 2.0));
  return seaward * uBeachSlope - bar;
}

// Exactly one swell line is in the water at a time. It is born far out where the haze
// already hides it, runs in toward the beach, rears up as the bottom comes to meet it and
// dies on the sand; the next is born as it goes.
//
// The crest is positioned by distance *seaward of the coast*, not by a world coordinate.
// That one choice does a lot of work: the crest automatically follows every bend of the
// coast and every contour of the bar, so the refraction that used to need its own term
// falls out of the geometry, and there is never more than one line to read.
//
// The profile is a single enveloped lobe rather than a periodic wave: one crest, a
// shallow trough either side, and flat water beyond. A sine train cannot do that, which
// is why the old spectrum always had three or four crests on screen at once.
float swellLine(float seaward, float crest, float width, float skew) {
  float s = (seaward - crest) / width;
  // The shoreward face compresses as the wave shoals while the seaward face stays long.
  // A symmetrical hump can only ever rise and fall; skewing it puts a steep wall on the
  // front and a long back, which is the shape of a wave about to break.
  float shaped = s < 0.0 ? s / mix(1.0, 0.3, skew) : s;
  return cos(shaped * 1.7) * exp(-shaped * shaped * 0.6);
}

// Fine surface texture, kept far below the swell. Without it the water between waves is
// glassy enough to read as a solid sheet rather than a surface.
float chopAt(vec2 p, float phase) {
  return sin(p.y * 0.85 - 5.0 * phase) * 0.6 + sin(p.x * 0.63 + p.y * 0.41 + 7.0 * phase) * 0.4;
}

// Shortest wavelength in the chop above, in metres.
const float CHOP_WAVELENGTH = 7.4;

// Spacing between mesh rows at a given distance. Rows are spaced geometrically — each a
// fixed ratio further out than the last — so this grows only linearly with distance.
float rowSpacingAt(float d, float logRange) {
  return d * logRange / uRows;
}

// Anything shorter than about twice the row spacing cannot be carried by the mesh, and
// what you get instead is an alias: a slow, wrong, low-frequency ghost of it that crawls
// across the far water as the phase advances. Fading features out as they stop being
// representable is the only honest option — the alternative is blobs drifting in from
// the side, and a crest that pops into existence the moment it reaches fine enough
// geometry to hold it.
float resolvable(float d, float wavelength, float logRange) {
  return 1.0 - smoothstep(0.35 * wavelength, 0.9 * wavelength, rowSpacingAt(d, logRange));
}

void main() {
  // Rows recede geometrically: each is a fixed ratio further out than the last, so their
  // spacing in metres grows linearly with distance rather than quadratically.
  //
  // This used to be a harmonic distribution, chosen so rows landed evenly *on screen*,
  // which mattered when the wireframe was drawn from the mesh parameter. It is drawn from
  // world position now, so mesh density no longer affects the grid at all — its only job
  // is carrying the wave. Under harmonic spacing a sixteen metre crest stopped being
  // representable past about forty metres and appeared to spring into existence there;
  // geometrically it survives out past two hundred, which is far enough to be born in
  // the haze and roll in.
  float logRange = log(uFar / uNear);
  float forward = uNear * exp(logRange * aGrid.y);
  float lateral = (aGrid.x - 0.5) * 2.0 * (uNearHalfWidth + forward * uSpread);

  // The grid is laid out from the eye, along the camera's own heading, and only then
  // placed into the world. Building it on the world axes, or from the origin, would leave
  // white gutters down the sides as soon as the view is yawed or dollied.
  vec2 plane = uEye + uForward * forward + uRight * lateral;

  float depth = depthAt(plane);

  // Dry sand is everything the water has not reached. The swell is flattened across the
  // same band rather than being cut off mid-wave and left poking through the beach.
  vShore = smoothstep(0.0, uShoreBlend * uBeachSlope, depth);

  // 1 in the shallows, 0 once the bottom drops away. The fragment shader tints the water
  // by this, which is the only thing in the scene that says "the shore is close" without
  // drawing a line to say it.
  vShallow = 1.0 - smoothstep(0.0, uDepthRef * 1.7, depth);

  // Measured against the fixed coast, not the moving waterline.
  float seaward = plane.y - coastAt(plane.x);
  // A wave slows as it shoals, so the crest decelerates on its way in. That is both what
  // actually happens and what keeps the line on screen: travelling in linearly, it would
  // spend most of its life as a speck out in the haze and the near water would be flat.
  float crest = mix(uWaveRunout, uWaveStart, pow(1.0 - uWaveCycle, 2.0));

  // Height follows the crest, not the vertex underneath it. Driving it from local depth
  // is what pinned the wave at full height for as long as any part of it sat in the
  // shallows — the gain saturated and simply stayed there.
  //
  // Green's law gives the rear-up as the bottom rises to meet the crest. The exponent is
  // the exaggeration dial: a quarter is the physical value and over this depth range it
  // is far too polite, so the default runs hotter.
  float crestDepth = max(crest * uBeachSlope, 0.0);
  float shoalGain = clamp(pow(uDepthRef / max(crestDepth, 0.05), uShoalPower), 1.0, uShoalMax);

  // Breaking is depth-limited, not distance-limited. A wave cannot stand taller than the
  // breaker index times the water underneath it — about 0.78 in the coastal literature —
  // and once it reaches that it has broken and what continues is a bore whose height is
  // capped by the depth it is running over. Because that depth falls to zero at the
  // waterline, the bore dies exactly there, on its own, smoothly. The old version cut the
  // wave off with a fixed distance, which is what made it rear up and then nosedive.
  float unbroken = shoalGain;
  float boreLimit = uBreakerIndex * crestDepth / max(uWaveHeight, 0.01);
  float amplitude = min(unbroken, boreLimit) * smoothstep(0.0, 0.08, uWaveCycle)
    * resolvable(crest, uWaveWidth, logRange);

  // A wave that has reached its depth limit is breaking; its front face stands up.
  float breakingNow = 1.0 - clamp(boreLimit / max(unbroken, 0.01), 0.0, 1.0);
  float skew = max(breakingNow, 1.0 - smoothstep(0.0, uDepthRef, crestDepth));

  float wave = swellLine(seaward, crest, uWaveWidth, skew) * amplitude;
  float chop = chopAt(plane, uSlow) * uChop * resolvable(forward, CHOP_WAVELENGTH, logRange);
  float swellHeight = (wave * uWaveHeight + chop) * uSwell * vShore;

  // The simulation only covers the near water, where a pointer can actually reach. Its
  // contribution is faded out at the edges of that box so pushed waves dissolve into the
  // swell instead of stopping at an invisible wall. The box travels with the camera, so
  // it is in view-relative metres rather than world ones.
  vec2 simUV = (vec2(lateral, forward) - uSimBox.xy) / uSimBox.zw;
  vec2 toEdge = min(simUV, 1.0 - simUV);
  float reach = smoothstep(0.0, 0.14, min(toEdge.x, toEdge.y));
  float simulated = texture2D(uHeight, clamp(simUV, 0.0, 1.0)).r * uAmplitude * reach * vShore;

  // Purely vertical. The trochoidal orbit that dragged the surface sideways is what made
  // the old swell look like it was rolling over itself.
  //
  // Clamped to the seabed: a trough deeper than the water is is water below the sand, and
  // in a wireframe that shows up as the grid cutting down through the beach.
  float height = max(swellHeight + simulated, -depth);
  vec3 world = vec3(plane, height);

  // The grid is measured in metres of *world* water. Two earlier versions of this were
  // wrong in different ways: the mesh parameter made it a screen-space grid, so the
  // number of squares between the shore and the horizon never changed; camera-relative
  // metres made it turn with the view, so the water always faced the camera however far
  // it was yawed. World metres are fixed to the sea, which is the only frame that makes
  // turning your head mean anything.
  vMetres = plane;
  vHeight = height;
  // Haze thickening with distance, and nothing else. There used to be a second term
  // fading out the last few rows by mesh parameter, to hide the far edge — but rows are
  // spaced harmonically, so the last few percent of them span everything from about forty
  // metres out to the far plane. That term was therefore dissolving the water at a fixed
  // ~40m however far the view distance was pushed. It is not needed: the mesh is built to
  // overrun the haze, so by the last row the fog has already taken the water to under
  // half a percent and there is no edge left to hide.
  vFog = exp(-forward * uFogDensity);

  gl_Position = uMVP * vec4(world, 1.0);
}`

const SURFACE_FRAG = `
precision highp float;

uniform float uGridSize;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uTint;
uniform float uTintStrength;

varying vec2 vMetres;
varying float vHeight;
varying float vFog;
varying float vShore;
varying float vShallow;

// Coverage of the grid at one cell size. Distance to the nearest line is measured in
// pixels via the screen-space derivative, so a line is one pixel wide whether it is at
// your feet or out near the horizon.
float gridMask(vec2 metres, float size) {
  vec2 cell = metres / size;
  vec2 cellsPerPixel = fwidth(cell);
  vec2 distanceToLine = abs(fract(cell - 0.5) - 0.5) / cellsPerPixel;
  return 1.0 - min(min(distanceToLine.x, distanceToLine.y), 1.0);
}

// Cells are never allowed to get closer together than this on screen.
const float MIN_CELL_PIXELS = 7.0;

void main() {
  // An infinite grid needs more than one scale. At a single cell size the cells fall
  // below a pixel somewhere out in the field, every line lands on the same fragment and
  // the water stops dead — which it did, about a third of the way out, no matter how far
  // the haze was set to let you see. Stepping the cell size up by powers of two as it
  // stops being resolvable, and cross-fading the two nearest levels, keeps the grid
  // legible all the way to the horizon; the squares simply get bigger as they recede.
  float metresPerPixel = max(fwidth(vMetres.x), fwidth(vMetres.y));
  float level = max(0.0, log2(metresPerPixel * MIN_CELL_PIXELS / uGridSize));
  float lower = floor(level);
  float sizeLower = uGridSize * exp2(lower);
  float line = mix(
    gridMask(vMetres, sizeLower),
    gridMask(vMetres, sizeLower * 2.0),
    level - lower
  );

  // Crests read darker than troughs, so the wireframe alone carries the shape of the
  // water and the surface between the lines never has to be drawn at all.
  float heightCue = 0.34 + 0.66 * smoothstep(-0.8, 0.8, vHeight);

  // vShore carries the grid to nothing exactly where the water meets the sand, so the
  // wireframe dissolves into the beach instead of ending on a hard line.
  float ink = line * vFog * heightCue * vShore;

  // The water body is otherwise the page colour exactly — opaque, so it hides the grid
  // behind it, and invisible, so the shore is simply the part of the surface where no
  // grid is left and nothing bleeds into the content below the fold. The only departure
  // is a trace of colour in the shallows, faded out again over dry sand and into the
  // haze, so the near water carries a hint of the bottom coming up under it.
  vec3 body = mix(uPaper, uTint, uTintStrength * vShallow * vShore * vFog);
  gl_FragColor = vec4(mix(body, uInk, ink), 1.0);
}`

const buildGrid = (across, deep) => {
  const columns = across + 1
  const rows = deep + 1
  const positions = new Float32Array(columns * rows * 2)

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const offset = (row * columns + column) * 2
      positions[offset] = column / across
      positions[offset + 1] = row / deep
    }
  }

  const indices = new Uint16Array(across * deep * 6)
  let cursor = 0
  for (let row = 0; row < deep; row++) {
    for (let column = 0; column < across; column++) {
      const nearLeft = row * columns + column
      const nearRight = nearLeft + 1
      const farLeft = nearLeft + columns
      const farRight = farLeft + 1
      indices[cursor++] = nearLeft
      indices[cursor++] = farLeft
      indices[cursor++] = nearRight
      indices[cursor++] = nearRight
      indices[cursor++] = farLeft
      indices[cursor++] = farRight
    }
  }

  return { positions, indices }
}

export const createSurface = ({ gl, caps, across, deep }) => {
  const [err, shader] = createProgram(gl, caps.version, SURFACE_VERT, SURFACE_FRAG)
  if (err) return [`surface program: ${err}`, null]

  const grid = buildGrid(across, deep)

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, grid.positions, gl.STATIC_DRAW)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, grid.indices, gl.STATIC_DRAW)

  const draw = ({
    mvp, heightTexture, amplitude, slow, swell, chop, simBox, extent, shore, heading,
    wave, gridSize, palette
  }) => {
    gl.useProgram(shader.program)
    gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, heightTexture)
    gl.uniform1i(shader.uniforms.uHeight, 0)
    gl.uniformMatrix4fv(shader.uniforms.uMVP, false, mvp)

    gl.uniform1f(shader.uniforms.uNear, extent.near)
    gl.uniform1f(shader.uniforms.uFar, extent.far)
    gl.uniform1f(shader.uniforms.uSpread, extent.spread)
    gl.uniform1f(shader.uniforms.uNearHalfWidth, extent.nearHalfWidth)
    gl.uniform1f(shader.uniforms.uRows, deep)
    gl.uniform1f(shader.uniforms.uFogDensity, extent.fogDensity)

    gl.uniform1f(shader.uniforms.uShoreDepth, shore.depth)
    gl.uniform1f(shader.uniforms.uShoreBlend, shore.blend)
    gl.uniform1f(shader.uniforms.uShoreCurve, shore.curve)
    gl.uniform3f(shader.uniforms.uHeadland, shore.headlandRise, shore.headlandAt, shore.headlandWidth)
    gl.uniform1f(shader.uniforms.uBeachSlope, shore.slope)
    gl.uniform3f(shader.uniforms.uBar, shore.barHeight, shore.barDistance, shore.barWidth)
    gl.uniform1f(shader.uniforms.uDepthRef, shore.depthRef)
    gl.uniform1f(shader.uniforms.uShoalMax, shore.shoalMax)
    gl.uniform1f(shader.uniforms.uShoalPower, shore.shoalPower)
    gl.uniform1f(shader.uniforms.uWaveStart, wave.start)
    gl.uniform1f(shader.uniforms.uWaveWidth, wave.width)
    gl.uniform1f(shader.uniforms.uWaveHeight, wave.height)
    gl.uniform1f(shader.uniforms.uWaveCycle, wave.cycle)
    gl.uniform1f(shader.uniforms.uWaveRunout, wave.runout)
    gl.uniform1f(shader.uniforms.uBreakerIndex, wave.breakerIndex)
    gl.uniform1f(shader.uniforms.uSwash, wave.swash)
    gl.uniform2f(shader.uniforms.uForward, heading.forwardX, heading.forwardY)
    gl.uniform2f(shader.uniforms.uRight, heading.rightX, heading.rightY)
    gl.uniform2f(shader.uniforms.uEye, heading.eyeX, heading.eyeY)

    gl.uniform1f(shader.uniforms.uSwell, swell)
    gl.uniform1f(shader.uniforms.uSlow, slow)
    gl.uniform1f(shader.uniforms.uChop, chop)
    gl.uniform1f(shader.uniforms.uAmplitude, amplitude)
    gl.uniform4f(shader.uniforms.uSimBox, simBox.x, simBox.y, simBox.width, simBox.height)

    gl.uniform1f(shader.uniforms.uGridSize, gridSize)
    gl.uniform3fv(shader.uniforms.uInk, palette.ink)
    gl.uniform3fv(shader.uniforms.uPaper, palette.paper)
    gl.uniform3fv(shader.uniforms.uTint, palette.tint)
    gl.uniform1f(shader.uniforms.uTintStrength, palette.tintStrength)

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.enableVertexAttribArray(shader.attributes.aGrid)
    gl.vertexAttribPointer(shader.attributes.aGrid, 2, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.drawElements(gl.TRIANGLES, grid.indices.length, gl.UNSIGNED_SHORT, 0)
  }

  const destroy = () => {
    gl.deleteProgram(shader.program)
    gl.deleteBuffer(positionBuffer)
    gl.deleteBuffer(indexBuffer)
  }

  return [null, { draw, destroy }]
}
