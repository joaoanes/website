import { createProgram, createTarget, destroyTarget, createFullscreenTriangle } from './gl'

// A height field integrated with the 2D wave equation on ping-ponged float targets.
//
//   h(t+1) = (2h(t) - h(t-1) + C * laplacian(h)) * damping
//
// The whole point of simulating rather than stamping analytic ripples: energy actually
// propagates, superposes and reflects. Dragging left to right injects a *line* source
// along the swept segment, and a line source is what produces a straight travelling
// front — you cannot get that by adding up concentric rings, however many slots you have.

// The three dials that decide what the water feels like.
//
// COURANT is wave speed: the 2D explicit scheme goes unstable above 0.5 and speed goes
// with its square root. VISCOSITY bleeds momentum every step, which is what separates a
// heavy liquid from a drum skin — a thin fluid rings, a thick one shoves and settles.
// DECAY pulls the whole field back to flat so the pool does not accumulate forever.
//
// Deliberately slow and thick: this sits behind body copy, and a background that moves
// faster than the eye ignores is a background that stops being one.
const COURANT = 0.06
const VISCOSITY = 0.99
const DECAY = 0.9995
const STEP_HZ = 50
const MAX_SUBSTEPS = 3

const SIM_VERT = `
attribute vec2 aPos;
varying vec2 vUv;

void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const SIM_FRAG = `
precision highp float;

uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uCourant;
uniform float uViscosity;
uniform float uDecay;
uniform vec4 uStroke;      // xy = segment start, zw = segment end, in 0..1 sim space
uniform float uStrokeAmp;
uniform float uStrokeRadius;
uniform float uStrokeBias;  // 0 = symmetric line source, 1 = full crest/trough dipole

varying vec2 vUv;

float capsuleDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * t);
}

void main() {
  vec2 state = texture2D(uState, vUv).rg;
  float height = state.r;
  float previous = state.g;

  float left  = texture2D(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float right = texture2D(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float down  = texture2D(uState, vUv - vec2(0.0, uTexel.y)).r;
  float up    = texture2D(uState, vUv + vec2(0.0, uTexel.y)).r;

  float laplacian = left + right + down + up - 4.0 * height;

  // Damping the momentum term on its own, rather than the whole result, is what makes the
  // surface behave like a thick fluid: a push still travels, but it stops ringing almost
  // immediately once you let go.
  float momentum = (height - previous) * uViscosity;
  float next = (height + momentum + uCourant * laplacian) * uDecay;

  if (uStrokeAmp > 0.0) {
    float dist = capsuleDistance(vUv, uStroke.xy, uStroke.zw);
    float falloff = exp(-(dist * dist) / (uStrokeRadius * uStrokeRadius));
    // Lean the impulse along the direction of travel: crest ahead of the pointer,
    // trough behind it. A symmetric source radiates both ways and reads as a splash;
    // the dipole reads as something being shoved through the water.
    vec2 travel = uStroke.zw - uStroke.xy;
    float lean = 1.0;
    if (dot(travel, travel) > 1e-8) {
      vec2 direction = normalize(travel);
      float along = dot(vUv - uStroke.zw, direction) / uStrokeRadius;
      lean = 1.0 + uStrokeBias * clamp(along, -1.0, 1.0);
    }
    next += uStrokeAmp * falloff * lean;
  }

  // Soak up energy approaching the border so the pool reads as open water rather than
  // a bathtub ringing with its own reflections.
  vec2 edge = min(vUv, 1.0 - vUv);
  float openness = smoothstep(0.0, 0.09, min(edge.x, edge.y));
  next *= mix(0.955, 1.0, openness);

  // ba carries the gradient so the render pass gets a normal from the same single fetch
  // it already needs for displacement.
  gl_FragColor = vec4(next, height, right - left, up - down);
}`

const SEED_FRAG = `
precision highp float;
varying vec2 vUv;

// Deterministic value noise; the surface should look the same on every load.
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y) * 2.0 - 1.0;
}

void main() {
  float h = valueNoise(vUv * 7.0) * 0.5 + valueNoise(vUv * 15.0) * 0.22;
  vec2 edge = min(vUv, 1.0 - vUv);
  h *= smoothstep(0.0, 0.2, min(edge.x, edge.y)) * 0.12;
  // equal current and previous height means the field starts at rest and settles rather
  // than exploding out of a discontinuity
  gl_FragColor = vec4(h, h, 0.0, 0.0);
}`

export const createWater = ({ gl, caps, size }) => {
  const [simErr, sim] = createProgram(gl, caps.version, SIM_VERT, SIM_FRAG)
  if (simErr) return [`water sim program: ${simErr}`, null]

  const [seedErr, seed] = createProgram(gl, caps.version, SIM_VERT, SEED_FRAG)
  if (seedErr) {
    gl.deleteProgram(sim.program)
    return [`water seed program: ${seedErr}`, null]
  }

  const [frontErr, front] = createTarget(gl, caps, size)
  if (frontErr) return [`water target: ${frontErr}`, null]

  const [backErr, back] = createTarget(gl, caps, size)
  if (backErr) {
    destroyTarget(gl, front)
    return [`water target: ${backErr}`, null]
  }

  const triangle = createFullscreenTriangle(gl)
  const texel = 1 / size
  let targets = { read: front, write: back }
  let accumulator = 0

  const drawFullscreen = ({ program, attributes }, target) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer)
    gl.viewport(0, 0, size, size)
    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.BLEND)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle)
    gl.enableVertexAttribArray(attributes.aPos)
    gl.vertexAttribPointer(attributes.aPos, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  const swap = () => {
    targets = { read: targets.write, write: targets.read }
  }

  const reset = () => {
    accumulator = 0
    drawFullscreen(seed, targets.write)
    swap()
    // seed both slots so the first integration sees a consistent (h, hPrev) pair
    drawFullscreen(seed, targets.write)
    swap()
  }

  // One integration step. `stroke` is consumed by the first substep only: re-injecting
  // the same impulse on every substep would scale input energy with the frame rate.
  const integrate = (stroke) => {
    gl.useProgram(sim.program)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, targets.read.texture)
    gl.uniform1i(sim.uniforms.uState, 0)
    gl.uniform2f(sim.uniforms.uTexel, texel, texel)
    gl.uniform1f(sim.uniforms.uCourant, COURANT)
    gl.uniform1f(sim.uniforms.uViscosity, VISCOSITY)
    gl.uniform1f(sim.uniforms.uDecay, DECAY)

    if (stroke) {
      gl.uniform4f(sim.uniforms.uStroke, stroke.fromX, stroke.fromY, stroke.toX, stroke.toY)
      gl.uniform1f(sim.uniforms.uStrokeAmp, stroke.amplitude)
      gl.uniform1f(sim.uniforms.uStrokeRadius, stroke.radius)
      gl.uniform1f(sim.uniforms.uStrokeBias, stroke.bias)
    } else {
      gl.uniform1f(sim.uniforms.uStrokeAmp, 0)
    }

    drawFullscreen(sim, targets.write)
    swap()
  }

  // Fixed timestep with an accumulator, so a 144Hz display and a struggling laptop agree
  // on how fast waves travel. Capped substeps stop a stalled tab from spiralling.
  const step = (deltaSeconds, stroke) => {
    accumulator = Math.min(accumulator + deltaSeconds, MAX_SUBSTEPS / STEP_HZ)
    let pending = stroke
    let ran = 0

    while (accumulator >= 1 / STEP_HZ && ran < MAX_SUBSTEPS) {
      accumulator -= 1 / STEP_HZ
      integrate(pending)
      pending = null
      ran++
    }

    // A frame that arrived too early to advance the sim still has to land its input,
    // otherwise fast flicks get silently dropped between steps.
    if (ran === 0 && stroke) integrate(stroke)
  }

  const destroy = () => {
    gl.deleteProgram(sim.program)
    gl.deleteProgram(seed.program)
    gl.deleteBuffer(triangle)
    destroyTarget(gl, front)
    destroyTarget(gl, back)
  }

  reset()

  return [null, {
    step,
    reset,
    destroy,
    size,
    get texture() { return targets.read.texture }
  }]
}
