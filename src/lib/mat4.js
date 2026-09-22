// Column-major 4x4 helpers. Only the handful of operations the water scene needs, which
// is why this exists instead of a matrix dependency.

export const multiply = (a, b) => {
  const out = new Float32Array(16)
  for (let column = 0; column < 4; column++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[column * 4 + k]
      out[column * 4 + row] = sum
    }
  }
  return out
}

export const perspective = (fovY, aspect, near, far) => {
  const f = 1 / Math.tan(fovY / 2)
  const range = 1 / (near - far)
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * range, -1,
    0, 0, 2 * far * near * range, 0
  ])
}

export const rotationX = (radians) => {
  const c = Math.cos(radians)
  const s = Math.sin(radians)
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1])
}

// Yaw. Z is up in this world, so turning the head is a rotation about Z, not Y.
export const rotationZ = (radians) => {
  const c = Math.cos(radians)
  const s = Math.sin(radians)
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}

export const translation = (x, y, z) =>
  new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1])

export const invert = (m) => {
  const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = m

  const b00 = a00 * a11 - a01 * a10
  const b01 = a00 * a12 - a02 * a10
  const b02 = a00 * a13 - a03 * a10
  const b03 = a01 * a12 - a02 * a11
  const b04 = a01 * a13 - a03 * a11
  const b05 = a02 * a13 - a03 * a12
  const b06 = a20 * a31 - a21 * a30
  const b07 = a20 * a32 - a22 * a30
  const b08 = a20 * a33 - a23 * a30
  const b09 = a21 * a32 - a22 * a31
  const b10 = a21 * a33 - a23 * a31
  const b11 = a22 * a33 - a23 * a32

  const determinant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
  if (!determinant) return null
  const d = 1 / determinant

  return new Float32Array([
    (a11 * b11 - a12 * b10 + a13 * b09) * d, (a02 * b10 - a01 * b11 - a03 * b09) * d,
    (a31 * b05 - a32 * b04 + a33 * b03) * d, (a22 * b04 - a21 * b05 - a23 * b03) * d,
    (a12 * b08 - a10 * b11 - a13 * b07) * d, (a00 * b11 - a02 * b08 + a03 * b07) * d,
    (a32 * b02 - a30 * b05 - a33 * b01) * d, (a20 * b05 - a22 * b02 + a23 * b01) * d,
    (a10 * b10 - a11 * b08 + a13 * b06) * d, (a01 * b08 - a00 * b10 - a03 * b06) * d,
    (a30 * b04 - a31 * b02 + a33 * b00) * d, (a21 * b02 - a20 * b04 - a23 * b00) * d,
    (a11 * b07 - a10 * b09 - a12 * b06) * d, (a00 * b09 - a01 * b07 + a02 * b06) * d,
    (a31 * b01 - a30 * b03 - a32 * b00) * d, (a20 * b03 - a21 * b01 + a22 * b00) * d
  ])
}

// Projects a normalised device coordinate back onto the z = 0 plane. Used to turn a
// pointer position into the world position of the water under it.
export const unprojectToGround = (inverseMVP, ndcX, ndcY) => {
  const at = (z) => {
    const v = [ndcX, ndcY, z, 1]
    const o = [0, 0, 0, 0]
    for (let i = 0; i < 4; i++) {
      o[i] = inverseMVP[i] * v[0] + inverseMVP[4 + i] * v[1] +
        inverseMVP[8 + i] * v[2] + inverseMVP[12 + i] * v[3]
    }
    return [o[0] / o[3], o[1] / o[3], o[2] / o[3]]
  }

  const near = at(-1)
  const far = at(1)
  const dz = far[2] - near[2]
  if (Math.abs(dz) < 1e-6) return null

  const t = -near[2] / dz
  if (t < 0) return null

  return [near[0] + (far[0] - near[0]) * t, near[1] + (far[1] - near[1]) * t]
}
