// Minimal WebGL helpers. Everything that can legitimately fail on a user's machine
// (context creation, float render targets, vertex texture fetch) returns an [err, value]
// tuple so callers can degrade instead of catching.

export const getContext = (canvas) => {
  const opts = { antialias: true, alpha: true, premultipliedAlpha: false, depth: true }
  const gl2 = canvas.getContext('webgl2', opts)
  if (gl2) return [null, { gl: gl2, version: 2 }]

  const gl1 = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts)
  if (gl1) return [null, { gl: gl1, version: 1 }]

  return ['webgl unavailable', null]
}

// What the good surface needs: render-to-float-texture (the simulation state) and
// sampling a texture from the vertex shader (the displacement). Both are ubiquitous in
// 2026 but a headless VM or a locked-down driver will still say no.
export const detectCapabilities = ({ gl, version }) => {
  const vertexUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
  const ext = (name) => gl.getExtension(name)

  if (version === 2) {
    const linear = ext('OES_texture_float_linear')
    const colorFloat = ext('EXT_color_buffer_float')
    const half = ext('EXT_color_buffer_half_float')
    if (!colorFloat && !half) return ['no renderable float texture', null]
    return [null, {
      version,
      vertexTextures: vertexUnits > 0,
      // half float is plenty for a height field and markedly faster on mobile tiles
      type: colorFloat && !half ? gl.FLOAT : gl.HALF_FLOAT,
      internalFormat: colorFloat && !half ? gl.RGBA32F : gl.RGBA16F,
      format: gl.RGBA,
      filter: linear ? gl.LINEAR : gl.NEAREST,
      derivatives: true
    }]
  }

  const halfExt = ext('OES_texture_half_float')
  const floatExt = ext('OES_texture_float')
  if (!halfExt && !floatExt) return ['no float textures', null]
  if (!ext('OES_standard_derivatives')) return ['no shader derivatives', null]

  const linear = halfExt ? ext('OES_texture_half_float_linear') : ext('OES_texture_float_linear')
  const type = halfExt ? halfExt.HALF_FLOAT_OES : gl.FLOAT

  return [null, {
    version,
    vertexTextures: vertexUnits > 0,
    type,
    internalFormat: gl.RGBA,
    format: gl.RGBA,
    filter: linear ? gl.LINEAR : gl.NEAREST,
    derivatives: true
  }]
}

// Shaders are authored once in GLSL ES 1.00 and rewritten to 3.00 for WebGL2 contexts.
// Writing both by hand would mean two copies of every wave equation to keep in sync.
const toGLSL3 = (source, isFragment) => {
  const body = source
    .replace(/^\s*#extension GL_OES_standard_derivatives.*$/gm, '')
    .replace(/\battribute\b/g, 'in')
    .replace(/\bvarying\b/g, isFragment ? 'in' : 'out')
    .replace(/\btexture2D\b/g, 'texture')
    .replace(/\bgl_FragColor\b/g, 'fragColor')

  const outDecl = isFragment ? 'out vec4 fragColor;\n' : ''
  return `#version 300 es\n${isFragment ? 'precision highp float;\n' : ''}${outDecl}${body}`
}

const preprocess = (source, version, isFragment) => {
  if (version === 2) return toGLSL3(source, isFragment)
  if (!isFragment) return source
  return `#extension GL_OES_standard_derivatives : enable\n${source}`
}

const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return [null, shader]

  const log = gl.getShaderInfoLog(shader)
  gl.deleteShader(shader)
  return [log, null]
}

// Uniform locations are resolved eagerly and handed back as a plain object, so the render
// loop never does a string lookup against the driver.
export const createProgram = (gl, version, vertexSource, fragmentSource) => {
  const vertex = preprocess(vertexSource, version, false)
  const fragment = preprocess(fragmentSource, version, true)

  const [vertexErr, vertexShader] = compileShader(gl, gl.VERTEX_SHADER, vertex)
  if (vertexErr) return [`vertex: ${vertexErr}`, null]

  const [fragmentErr, fragmentShader] = compileShader(gl, gl.FRAGMENT_SHADER, fragment)
  if (fragmentErr) {
    gl.deleteShader(vertexShader)
    return [`fragment: ${fragmentErr}`, null]
  }

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    return [log, null]
  }

  const uniforms = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < count; i++) {
    const name = gl.getActiveUniform(program, i).name.replace('[0]', '')
    uniforms[name] = gl.getUniformLocation(program, name)
  }

  const attributes = {}
  const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
  for (let i = 0; i < attributeCount; i++) {
    const name = gl.getActiveAttrib(program, i).name
    attributes[name] = gl.getAttribLocation(program, name)
  }

  return [null, { program, uniforms, attributes }]
}

export const createTarget = (gl, caps, size) => {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(
    gl.TEXTURE_2D, 0, caps.internalFormat, size, size, 0, caps.format, caps.type, null
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, caps.filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, caps.filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const framebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteTexture(texture)
    gl.deleteFramebuffer(framebuffer)
    return [`framebuffer incomplete: 0x${status.toString(16)}`, null]
  }

  return [null, { texture, framebuffer, size }]
}

export const destroyTarget = (gl, target) => {
  if (!target) return
  gl.deleteTexture(target.texture)
  gl.deleteFramebuffer(target.framebuffer)
}

// A single fullscreen triangle beats a quad: no diagonal seam, 1 primitive, fewer verts.
export const createFullscreenTriangle = (gl) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  return buffer
}
