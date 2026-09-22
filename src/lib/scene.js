import { getContext, detectCapabilities } from './gl'
import {
  multiply, perspective, rotationX, rotationZ, translation, invert, unprojectToGround
} from './mat4'
import { createWater } from './water'
import { createSurface } from './surface'
import { createLegacySurface } from './legacy'

const LOOP_MS = 5000
// Every wave train is an integer harmonic of this, so the whole swell closes on itself
// exactly and loops forever without a seam.
const SLOW_LOOP_MS = 30000

// Up on the dune looking out over the bay, wide lens, the coast running diagonally out of
// frame so you can follow it into the distance.
//
// The tilt is what sets the shot: the horizon lands at tan(tilt)/tan(halfFov) in clip
// space, so 0.1rad against a 71 degree lens puts it a little over two fifths of the way
// down the frame. The nearest visible water sits around seven and a half metres out.
//
// Height is what buys visible distance — the screen gap between a point and the horizon
// goes as eyeHeight/distance — which is why the view distance reads from up here and was
// worth almost nothing down at head height, where everything past a hundred metres
// collapsed into the last few pixels under the horizon.
//
// Mutable so the tuning panel can drive them. `pitch` is tilt below level in radians and
// `fov` is degrees, because those are the units you actually think in.
const CAMERA = {
  eyeHeight: 6.7,
  pitch: 0.1,
  fov: 71,
  yaw: -0.61,
  roll: 0.03,
  // Metres the eye is dollied back along its own heading. Negative wades in.
  back: 8
}

// The surface the incident starts on is the old one, and it gets the old camera with it:
// a 90 degree lens tipped almost flat, two and a half units back. Rendering v1 through
// the beach camera would be showing a fixed scene that never existed.
const LEGACY_CAMERA = { fov: (90 * Math.PI) / 180, pitch: -1.5, distance: 2.5 }

// The water, in metres, from just in front of the eye out to where the haze has long
// since swallowed it. `far`, `fogDensity` and `spread` are all filled in at resize —
// the first two from `horizon`, the third from the real frustum, because a guessed
// constant leaves white gutters down the sides at any aspect it was not tuned at.
const WATER = {
  near: 1.2,
  nearHalfWidth: 1.6,
  // How far you can see, in metres — the distance at which the haze has finished
  // dissolving the water. This is the only one of these three worth a dial: `far` and
  // `fogDensity` are derived from it at resize, because setting them independently just
  // means one of them silently wins. Push the mesh out past a dense haze and nothing
  // changes; thin the haze without pushing the mesh out and the last row becomes an edge.
  horizon: 440,
  // Metres per grid square on the water. This is the scale of the whole scene: it is what
  // decides how many squares stack up between the shore and the horizon.
  gridSize: 2.5,
  far: 700,
  spread: 1,
  fogDensity: 0.008
}

// vFog is exp(-distance * density); at the horizon distance that leaves about 3% of the
// water still showing, which reads as gone.
const FOG_FALLOFF = 3.5
// The mesh has to outrun the haze or its last row shows up as a straight edge in mid-air.
const MESH_OVERRUN = 1.6

// A little wider than the frustum strictly needs, so the mesh edge stays off screen when
// a wave crest shifts a vertex sideways, and so the rolled frustum's corners stay
// covered.
const WIDTH_MARGIN = 1.3

// The waterline, in metres out from the eye. `blend` is the band of shallows the grid
// fades out across, and `curve` is how far the coast wanders along its length. Everything
// shoreward of the line is bare page, which is what keeps the water off the content below
// the fold.
const SHORE = {
  depth: 1.3,
  blend: 4.6,
  curve: 1.56,
  // The smirk. The base curve is kept almost flat so this is the only thing bending the
  // waterline. The rise is small in metres and large on screen: this close to the eye the
  // perspective is steep, so a metre of extra distance lifts the waterline a long way up
  // the frame.
  headlandRise: 4.9,
  headlandAt: 9,
  headlandWidth: 18.5,
  // Gradient of the sand, and the ridge lying parallel to it: height in metres, how far
  // out it sits, how broad it is. The bar is the strongest cue in the scene — waves rear
  // up crossing it and settle again in the trough behind.
  slope: 0.095,
  barHeight: 1.5,
  barDistance: 26,
  barWidth: 11,
  // Depth at which a wave starts to feel the bottom, and how far it is allowed to grow.
  depthRef: 5.5,
  shoalMax: 3.0,
  shoalPower: 0.6
}

// One wave at a time. `start` is how far out it is born — far enough that the haze has it
// before it fades in — and the period is how long it takes to run in and die on the sand.
const WAVE = {
  periodMs: 10000,
  start: 200,
  // Extent of the crest across its direction of travel, in metres — how thick the band of
  // raised water is, shoreward edge to seaward edge. Not a wavelength and not a length
  // along the coast: the crest is a ridge running the whole shoreline.
  thickness: 22.5,
  height: 3.7,
  // How far up the sand the crest carries before it is spent.
  runout: -1.5,
  // The breaker index: a wave breaks once its height reaches this fraction of the water
  // depth beneath it. ~0.78 is the standard value in the coastal literature; this runs
  // well over it deliberately, which lets the crest hold its height further into the
  // shallows than real water would before the bore limit takes it.
  breakerIndex: 1.34,
  // Swash: how far up the sand the broken bore throws a sheet of water, and when in the
  // cycle it lands.
  swashReach: 2.4,
  swashStart: 0.72,
  // The backwash: once the bore has spent itself on the sand, the water draining back off
  // it leaves as a small wave of its own, running seaward. It is wiped out well before the
  // next one arrives, so nothing has to be kept in sync with anything.
  backwashStart: 0.81,
  // Signed. Negative emits a trough running out instead of a crest — the water drawing
  // down and away rather than a bulge leaving. The seabed clamp below limits how deep a
  // trough can actually go this close in, see the note on backwashOffset.
  backwashHeight: 0.4,
  backwashThickness: 12.5,
  // Born this far seaward of the coast rather than on it. The crest cannot corrupt the
  // sand — it is added to the height and masked by vShore, never fed back into depthAt()
  // — but starting it on the waterline meant it spent its strongest moment being masked
  // away and clipped against the seabed clamp. Out past the sand blend it is simply in
  // open water.
  backwashOffset: 18,
  // Metres travelled over the window. This is deliberately decoupled from the incoming
  // crest's speed, and that is a cheat: reach / window is an implied velocity, and at
  // these defaults it works out well above what the crest is doing. It buys travel
  // without touching the height, because height is a function of window position alone
  // and never of distance.
  //
  // It was locked to the crest's speed for a while, which is physically right and looked
  // wrong — at 6 m/s over a 1.5s window the wave covered nine metres and never read as
  // going anywhere. Use backwashImpliedSpeed() if you want to see what you are asking
  // for in m/s.
  backwashReach: 60
}

// Uprush is fast and backwash is slow — roughly a quarter of the window running up and
// three quarters draining back. A symmetric envelope reads as a pulsing line rather than
// as water being thrown up a beach.
const smoothstep = (edge0, edge1, x) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

const swashAt = (cycle) => {
  const t = Math.max(0, (cycle - WAVE.swashStart) / (1 - WAVE.swashStart))
  return t < 0.25
    ? smoothstep(0, 0.25, t)
    : 1 - smoothstep(0.25, 1, t)
}

// Instantaneous speed of the incoming crest, in metres per second. The travel curve is
// mix(runout, start, (1 - cycle)^2), so this is its derivative: 2 * (start - runout) *
// (1 - cycle) / period. It decelerates all the way in as it shoals, which is why the
// crest's speed has to be sampled at a moment rather than stated as one number.
export const crestSpeedAt = (cycle) =>
  (2 * (WAVE.start - WAVE.runout) * Math.max(0, 1 - cycle)) / (WAVE.periodMs / 1000)

// What the backwash reach actually amounts to in m/s, and how that compares to the crest
// it left. Exported so the cheat is inspectable rather than buried: the previous version
// of this control hid exactly this number and quietly became 70 m/s when the window
// changed.
export const backwashImpliedSpeed = () => {
  const windowSeconds = (1 - WAVE.backwashStart) * (WAVE.periodMs / 1000)
  const speed = WAVE.backwashReach / windowSeconds
  return { speed, crest: crestSpeedAt(WAVE.backwashStart), windowSeconds }
}

// Where the backwash wave is, and how big it still is, this frame. It leaves the waterline
// as the swash drains, runs out to sea and is spent by the end of the window — which is
// why it needs no oscillator and no state: it is just another crest, going the other way.
const backwashAt = (cycle) => {
  const t = (cycle - WAVE.backwashStart) / (1 - WAVE.backwashStart)
  if (t <= 0 || t >= 1) return { crest: 0, height: 0 }
  return {
    crest: WAVE.backwashOffset + WAVE.backwashReach * t,
    // Faded in over the first stretch so it does not pop into being at the waterline,
    // then run down to nothing.
    height: WAVE.backwashHeight * (1 - t) * Math.min(1, t / 0.15)
  }
}

// The simulation only covers water a pointer can plausibly reach. Everything past this is
// swell alone, which is also why the sim texture can stay small.
const SIM_BOX = { x: -22, y: 0.9, width: 44, height: 44 }

// Impulse shape, in simulation-texture units. The radius sets the wavelength of what the
// pointer makes; the bias leans the impulse along the direction of travel so a drag
// pushes a crest ahead of itself instead of radiating evenly.
// A wide impulse makes a long wavelength, which is what reads as a swell rolling across
// the pool rather than a sharp dent chasing the cursor.
const STROKE_RADIUS = 0.055
const STROKE_BIAS = 0.85
const MAX_SEGMENT = 0.35

// Energy per unit of distance travelled, not per frame. Injecting per frame means a
// pointer resting in one spot keeps pumping the pool until it piles into a mountain,
// and means a fast drag deposits the same total as a slow one.
const HOVER_GAIN = 0.22
const DRAG_GAIN = 0.55
const MAX_STROKE_AMPLITUDE = 0.02
const TAP_AMPLITUDE = 0.028

const SWELL = {
  // Overall scale on the swell, the amplitude of the fine texture under it, and the
  // metres of wave height the pointer is allowed to add.
  height: 1,
  chop: 0.055,
  pointer: 1.4
}

// Everything the tuning panel can reach. Mutating these takes effect on the next frame;
// camera changes additionally need applyTuning() so the matrices get rebuilt.
// Live scenes register their resize here so the tuning panel can rebuild camera matrices
// without needing a handle on the instance. Temporary, alongside SceneControls.svelte.
const liveScenes = []
export const applySceneTuning = () => liveScenes.forEach((rebuild) => rebuild())

export const sceneTuning = {
  camera: CAMERA,
  water: WATER,
  shore: SHORE,
  wave: WAVE,
  swell: SWELL
}

// More rows than columns: depth is the axis that has to carry the wave as it travels in,
// and row count is what sets how far out a crest can still be represented. Vertex counts
// stay inside 16-bit indices — 221 x 129 is about 28k vertices.
const QUALITY = {
  3: { sim: 256, across: 128, deep: 220, maxDpr: 1.5 },
  2: { sim: 192, across: 96, deep: 168, maxDpr: 1.25 },
  1: { sim: 128, across: 72, deep: 120, maxDpr: 1 }
}

// `paper` has to match the page behind the canvas so the water body stays invisible.
// `tint` is the one colour in the scene, held to a trace and confined to the shallows.
const PALETTES = {
  light: {
    ink: new Float32Array([0, 0, 0]),
    paper: new Float32Array([1, 1, 1]),
    tint: new Float32Array([0.29, 0.53, 0.63]),
    tintStrength: 0.3
  },
  dork: {
    ink: new Float32Array([1, 1, 1]),
    paper: new Float32Array([0, 0, 0]),
    tint: new Float32Array([0.31, 0.58, 0.7]),
    tintStrength: 0.34
  }
}

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const createScene = ({ canvas, host, dorkMode = false, tier = 3 }) => {
  const [contextErr, context] = getContext(canvas)
  if (contextErr) return [contextErr, null]

  const { gl } = context
  const [capsErr, caps] = detectCapabilities(context)

  const quality = QUALITY[Math.max(1, Math.min(3, tier))]
  // No float targets or no vertex texture fetch means no simulation; the scene still
  // renders, it just never leaves the old surface behind.
  const canSimulate = !capsErr && caps.vertexTextures
  const activeCaps = canSimulate ? caps : { version: context.version }

  const [legacyErr, legacy] = createLegacySurface({ gl, caps: activeCaps })
  if (legacyErr) return [legacyErr, null]

  const built = canSimulate
    ? buildSimulation({ gl, caps, quality })
    : [capsErr || 'no vertex texture fetch', null]
  const [simulationErr, simulation] = built

  let palette = dorkMode ? PALETTES.dork : PALETTES.light
  let phase = 'legacy'
  let glitch = 0
  let glitchTarget = 0
  let mvp = null
  let legacyMVP = null
  let inverseMVP = null
  let heading = null
  let frame = null
  let lastFrameTime = null
  let running = false
  let visible = true
  let pointer = null
  let stroke = null

  const reduced = prefersReducedMotion()

  const resize = () => {
    // Measured from the canvas's own box, not from the pointer host. The two are no
    // longer the same shape: the host is the fold, while the canvas runs past it to meet
    // the header's bottom border. Sizing the drawing buffer to the host would leave it
    // short of its CSS box and the whole scene stretched to fit.
    const width = Math.max(1, canvas.clientWidth || host.offsetWidth)
    const height = Math.max(1, canvas.clientHeight || host.offsetHeight)
    const dpr = Math.min(quality.maxDpr, window.devicePixelRatio || 1)

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)

    const aspect = width / height
    const fieldOfView = (CAMERA.fov * Math.PI) / 180

    WATER.fogDensity = FOG_FALLOFF / WATER.horizon
    WATER.far = Math.max(200, WATER.horizon * MESH_OVERRUN)
    const projection = perspective(fieldOfView, aspect, 0.1, WATER.far * 1.4)
    // Yaw first, about the world up axis, then pitch in the camera's own frame.
    // Where the camera is looking, on the water plane, and where it is standing. The
    // mesh is laid out along these axes and from this point, so neither the yaw nor the
    // dolly can open gutters at the sides of the frame.
    const forwardX = Math.sin(CAMERA.yaw)
    const forwardY = Math.cos(CAMERA.yaw)
    const eyeX = -forwardX * CAMERA.back
    const eyeY = -forwardY * CAMERA.back

    // Roll about the view axis, then pitch, then yaw about world up, then step to the
    // eye. Order matters: roll has to be outermost or it turns into extra yaw. The
    // translation is by minus the eye, which is why the dolly signs invert here.
    const view = multiply(
      multiply(rotationZ(CAMERA.roll), rotationX(-Math.PI / 2 + CAMERA.pitch)),
      multiply(rotationZ(CAMERA.yaw), translation(-eyeX, -eyeY, -CAMERA.eyeHeight))
    )
    mvp = multiply(projection, view)
    inverseMVP = invert(mvp)

    const legacyProjection = perspective(LEGACY_CAMERA.fov, aspect, 0.2, 48)
    legacyMVP = multiply(
      legacyProjection,
      multiply(rotationX(LEGACY_CAMERA.pitch), translation(0, 0, -LEGACY_CAMERA.distance))
    )

    heading = {
      forwardX,
      forwardY,
      rightX: Math.cos(CAMERA.yaw),
      rightY: -Math.sin(CAMERA.yaw),
      eyeX,
      eyeY
    }

    // Half the horizontal extent the camera can see per metre of depth. The mesh rows are
    // built to exactly this, so the water reaches the sides of the frame at every depth.
    WATER.spread = Math.tan(fieldOfView / 2) * aspect * WIDTH_MARGIN
  }

  // Pointer position arrives in client pixels and has to become a coordinate in the
  // simulation texture; the intermediate step is the point on the water plane under the
  // cursor, which is a ray/plane intersection through the inverse camera.
  const toSimSpace = (clientX, clientY) => {
    if (!inverseMVP) return null
    const bounds = canvas.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return null

    const ndcX = ((clientX - bounds.left) / bounds.width) * 2 - 1
    const ndcY = -((((clientY - bounds.top) / bounds.height) * 2) - 1)
    const ground = unprojectToGround(inverseMVP, ndcX, ndcY)
    if (!ground) return null

    // Back into the camera's own frame, which is where the simulated box lives. Relative
    // to the eye, not the origin, or the box slides out from under the pointer the moment
    // the camera is dollied.
    const relX = ground[0] - heading.eyeX
    const relY = ground[1] - heading.eyeY
    const lateral = relX * heading.rightX + relY * heading.rightY
    const forward = relX * heading.forwardX + relY * heading.forwardY
    const u = (lateral - SIM_BOX.x) / SIM_BOX.width
    const v = (forward - SIM_BOX.y) / SIM_BOX.height
    // Rays cast near the horizon graze the water and land kilometres out; anything
    // outside the simulated box simply is not touchable.
    if (u < 0 || u > 1 || v < 0 || v > 1) return null

    return { u, v }
  }

  // Pointer events arrive far more often than frames — a 1000Hz mouse fires ~16 moves per
  // frame. Keeping only the last one would inject a sixteenth of the gesture and throw
  // the rest away, which is the difference between a travelling front and a faint blip.
  // Instead the whole path swept since the last simulated step becomes one line source.
  const extendStroke = (from, to, amplitude) => {
    if (!stroke) {
      stroke = {
        fromX: from.u, fromY: from.v, toX: to.u, toY: to.v,
        amplitude, radius: STROKE_RADIUS, bias: STROKE_BIAS
      }
      return
    }
    stroke.toX = to.u
    stroke.toY = to.v
    stroke.amplitude = Math.min(stroke.amplitude + amplitude, MAX_STROKE_AMPLITUDE)
  }

  const onPointerMove = (event) => {
    if (phase !== 'fixed' || !simulation) return
    const next = toSimSpace(event.clientX, event.clientY)
    if (!next) return

    const previous = pointer
    pointer = next
    if (!previous) return

    const dx = next.u - previous.u
    const dy = next.v - previous.v
    const distance = Math.hypot(dx, dy)
    if (distance < 1e-5) return

    // Clamp so a pointer that jumped in from another tab cannot paint a stripe across the
    // whole pool in a single frame.
    const travelled = Math.min(distance, MAX_SEGMENT)
    const scale = travelled / distance
    const gain = event.buttons ? DRAG_GAIN : HOVER_GAIN

    extendStroke(
      { u: next.u - dx * scale, v: next.v - dy * scale },
      next,
      Math.min(gain * travelled, MAX_STROKE_AMPLITUDE)
    )
  }

  const onPointerLeave = () => {
    pointer = null
  }

  const onPointerDown = (event) => {
    if (phase !== 'fixed' || !simulation) return
    const next = toSimSpace(event.clientX, event.clientY)
    if (!next) return
    pointer = next
    stroke = {
      fromX: next.u, fromY: next.v, toX: next.u, toY: next.v,
      amplitude: TAP_AMPLITUDE, radius: 0.03, bias: 0
    }
  }

  const render = (now) => {
    // Same five second loop both surfaces have always used: because every term is a sine
    // or cosine of delta, the animation closes exactly at 2pi and is independent of the
    // frame rate it happens to be rendering at.
    const delta = (2 * (now % LOOP_MS) * Math.PI) / LOOP_MS
    const slow = (2 * (now % SLOW_LOOP_MS) * Math.PI) / SLOW_LOOP_MS
    // 0 when the wave is born far out, 1 as it dies on the sand.
    const cycle = (now % WAVE.periodMs) / WAVE.periodMs

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    if (phase === 'fixed' && simulation) {
      simulation.surface.draw({
        mvp,
        heightTexture: simulation.water.texture,
        amplitude: SWELL.pointer,
        slow,
        swell: SWELL.height,
        chop: SWELL.chop,
        simBox: SIM_BOX,
        extent: WATER,
        gridSize: WATER.gridSize,
        shore: SHORE,
        heading,
        wave: { ...WAVE, cycle, swash: WAVE.swashReach * swashAt(cycle), backwash: backwashAt(cycle) },
        palette
      })
      return
    }

    legacy.draw({ mvp: legacyMVP, delta, glitch, palette })
  }

  const loop = (timestamp) => {
    frame = requestAnimationFrame(loop)

    const elapsed = lastFrameTime === null ? 0 : (timestamp - lastFrameTime) / 1000
    lastFrameTime = timestamp

    glitch += (glitchTarget - glitch) * 0.12

    if (phase === 'fixed' && simulation) {
      // Clamped so returning to a backgrounded tab does not try to catch up on minutes
      // of simulation in one frame.
      simulation.water.step(Math.min(elapsed, 0.05), stroke)
      stroke = null
    }

    render(timestamp)
  }

  const start = () => {
    if (running || !visible) return
    running = true
    lastFrameTime = null
    frame = requestAnimationFrame(loop)
  }

  const stop = () => {
    running = false
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
  }

  const setVisible = (next) => {
    visible = next
    if (next) return start()
    stop()
  }

  // A background that nobody is looking at should not be costing anyone a GPU. Both the
  // tab being hidden and the hero being scrolled past stop the loop entirely.
  let intersecting = true
  const onVisibilityChange = () => setVisible(!document.hidden && intersecting)
  const observer = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting
      setVisible(!document.hidden && intersecting)
    }, { threshold: 0 })
    : null

  const onContextLost = (event) => {
    event.preventDefault()
    stop()
  }

  resize()
  liveScenes.push(resize)
  window.addEventListener('resize', resize)

  // The canvas can change size without the window doing so — the background's reach past
  // the fold is measured from live layout — so watch the element itself rather than
  // relying on window resize alone.
  const sizeObserver = typeof ResizeObserver === 'function'
    ? new ResizeObserver(() => resize())
    : null
  if (sizeObserver) sizeObserver.observe(canvas)
  document.addEventListener('visibilitychange', onVisibilityChange)
  canvas.addEventListener('webglcontextlost', onContextLost)
  host.addEventListener('pointermove', onPointerMove)
  host.addEventListener('pointerdown', onPointerDown)
  host.addEventListener('pointerleave', onPointerLeave)
  if (observer) observer.observe(host)

  if (reduced) {
    // One frame, then nothing moves. Honouring the preference also happens to be the
    // cheapest possible mode.
    render(performance.now())
  } else {
    start()
  }

  return [null, {
    canSimulate: Boolean(simulation),
    simulationError: simulationErr,
    resize,

    // The tuning panel mutates sceneTuning directly; this rebuilds anything cached off
    // the camera. Everything else is read fresh each frame.
    applyTuning: resize,

    setPhase: (next) => {
      if (next === phase) return
      phase = next
      glitchTarget = next === 'glitch' ? 1 : 0
      if (next === 'fixed' && simulation) simulation.water.reset()
      if (reduced) render(performance.now())
    },

    setDorkMode: (next) => {
      palette = next ? PALETTES.dork : PALETTES.light
      if (reduced) render(performance.now())
    },

    destroy: () => {
      stop()
      const registered = liveScenes.indexOf(resize)
      if (registered !== -1) liveScenes.splice(registered, 1)
      window.removeEventListener('resize', resize)
      if (sizeObserver) sizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointerleave', onPointerLeave)
      if (observer) observer.disconnect()
      legacy.destroy()
      if (simulation) {
        simulation.water.destroy()
        simulation.surface.destroy()
      }
    }
  }]
}

const buildSimulation = ({ gl, caps, quality }) => {
  const [waterErr, water] = createWater({ gl, caps, size: quality.sim })
  if (waterErr) return [waterErr, null]

  const [surfaceErr, surface] = createSurface({
    gl, caps, across: quality.across, deep: quality.deep
  })
  if (surfaceErr) {
    water.destroy()
    return [surfaceErr, null]
  }

  return [null, { water, surface }]
}
