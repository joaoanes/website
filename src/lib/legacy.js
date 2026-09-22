import { createProgram } from './gl'
import { noise } from './noise'

// The surface as it was: a 20x20 plane, two sines, and a wireframe pass that animates
// while the fill underneath it stays put. Kept faithful on purpose — it is the "before"
// half of the incident, so it has to be the actual old shader rather than an impression
// of one. It also doubles as the fallback when a machine cannot render to a float target.

const LEGACY_VERT = `
attribute vec3 aPos;

uniform mat4 uMVP;
uniform float uDelta;
uniform float uDisplace;
uniform float uGlitch;
uniform float uSeed;

void main() {
  vec3 p = aPos;
  float zOffset = p.z / 2.0;
  p.z = p.z + uDisplace * zOffset * (sin(uDelta) * sin(p.x) + cos(uDelta) * cos(p.y));

  if (uGlitch > 0.001) {
    float row = floor(p.y * 2.0);
    float r = fract(sin(row * 91.17 + uSeed) * 43758.5453);
    p.x += uGlitch * (r - 0.5) * 8.0 * step(0.42, r);
    p.y += uGlitch * (fract(r * 13.1) - 0.5) * 2.0;
    p.z += uGlitch * 1.4 * sin(p.x * 5.0 + uSeed * 6.0) * step(0.25, fract(r * 7.3));
  }

  gl_Position = uMVP * vec4(p, 1.0);
}`

const LEGACY_FRAG = `
precision mediump float;

uniform float uWire;
uniform vec3 uInk;
uniform vec3 uPaper;

void main() {
  gl_FragColor = uWire > 0.5 ? vec4(uInk, 1.0) : vec4(uPaper, 1.0);
}`

const buildGrid = (size, segments) => {
  const span = segments + 1
  const positions = new Float32Array(span * span * 3)
  for (let row = 0; row < span; row++) {
    for (let column = 0; column < span; column++) {
      const x = -size / 2 + (size * column) / segments
      const y = -size / 2 + (size * row) / segments
      const offset = (row * span + column) * 3
      positions[offset] = x
      positions[offset + 1] = y
      positions[offset + 2] = noise(x, y) * 1.5
    }
  }

  const triangles = []
  const lines = []
  for (let row = 0; row < segments; row++) {
    for (let column = 0; column < segments; column++) {
      const topLeft = row * span + column
      const topRight = topLeft + 1
      const bottomLeft = topLeft + span
      const bottomRight = bottomLeft + 1
      triangles.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight)
      // the original wireframe came from a triangulated plane, diagonals included
      lines.push(topLeft, topRight, topLeft, bottomLeft, topRight, bottomLeft)
    }
  }
  for (let i = 0; i < segments; i++) lines.push(segments * span + i, segments * span + i + 1)
  for (let j = 0; j < segments; j++) lines.push(j * span + segments, (j + 1) * span + segments)

  return {
    positions,
    triangles: new Uint16Array(triangles),
    lines: new Uint16Array(lines)
  }
}

export const createLegacySurface = ({ gl, caps, size = 20, segments = 20 }) => {
  const [err, shader] = createProgram(gl, caps.version, LEGACY_VERT, LEGACY_FRAG)
  if (err) return [`legacy program: ${err}`, null]

  const grid = buildGrid(size, segments)
  const seed = Math.random() * 100

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, grid.positions, gl.STATIC_DRAW)

  const triangleBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, grid.triangles, gl.STATIC_DRAW)

  const lineBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, grid.lines, gl.STATIC_DRAW)

  const draw = ({ mvp, delta, glitch, palette }) => {
    gl.useProgram(shader.program)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.POLYGON_OFFSET_FILL)
    gl.polygonOffset(2.0, 4.0)

    gl.uniformMatrix4fv(shader.uniforms.uMVP, false, mvp)
    gl.uniform1f(shader.uniforms.uDelta, delta)
    gl.uniform1f(shader.uniforms.uGlitch, glitch)
    gl.uniform1f(shader.uniforms.uSeed, seed)
    gl.uniform3fv(shader.uniforms.uInk, palette.ink)
    gl.uniform3fv(shader.uniforms.uPaper, palette.paper)

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.enableVertexAttribArray(shader.attributes.aPos)
    gl.vertexAttribPointer(shader.attributes.aPos, 3, gl.FLOAT, false, 0, 0)

    gl.depthMask(true)
    gl.uniform1f(shader.uniforms.uWire, 0)
    gl.uniform1f(shader.uniforms.uDisplace, 0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer)
    gl.drawElements(gl.TRIANGLES, grid.triangles.length, gl.UNSIGNED_SHORT, 0)

    gl.depthMask(false)
    gl.uniform1f(shader.uniforms.uWire, 1)
    gl.uniform1f(shader.uniforms.uDisplace, 1)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer)
    gl.drawElements(gl.LINES, grid.lines.length, gl.UNSIGNED_SHORT, 0)

    gl.disable(gl.POLYGON_OFFSET_FILL)
    gl.depthMask(true)
  }

  const destroy = () => {
    gl.deleteProgram(shader.program)
    gl.deleteBuffer(positionBuffer)
    gl.deleteBuffer(triangleBuffer)
    gl.deleteBuffer(lineBuffer)
  }

  return [null, { draw, destroy }]
}
