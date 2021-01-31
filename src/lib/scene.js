import * as THREE from 'three'
import { noise } from "./noise"

export let uniforms = {
  'dorkMode': {
    value: false
  },
  'delta': {
    value: 1
  }
}

//TODO: singletonsssssssssssssssssss
let scene
let renderer
let main

let frame
let gridGeometry
let camera

const animationTime = 5000

const buildScene = () => {
  //TODO: Consider disposing of previous scene
  if (!gridGeometry) {
    gridGeometry = new THREE.PlaneGeometry(20, 20, 20, 20)
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)

    gridGeometry.vertices = gridGeometry.vertices.map(
      ({ x, y }) => ({ x, y, z: noise(x, y) * 1.5 })
    )

  }
  camera.position.z = 2.5
  camera.rotation.x = 1.5

  var gridMaterial = new THREE.MeshBasicMaterial({
    color: uniforms['dorkMode'].value ? 0 : 0xffffff,
  })

  const wireframeMaterial = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
  })

  var gridMesh = new THREE.Mesh(gridGeometry, gridMaterial)
  scene.add(gridMesh)

  var wireGeometry = new THREE.WireframeGeometry(gridGeometry)
  var wireMesh = new THREE.LineSegments(wireGeometry, wireframeMaterial)
  scene.add(wireMesh)
}

const renderLoop = () => {
  // since our transforms use sin and cos, this animation loops around at 2pi
  // the idea is to linearly scale from frametime(start) = 0 to frametime(end aka animatiomTime) = 2pi
  // this makes the animation independent from the actual fps it's rendering at
  uniforms.delta.value = ((2 * (Date.now() % animationTime)) * Math.PI) / animationTime

  frame = requestAnimationFrame(renderLoop)
  renderer.render(scene, camera)
}

const resize = () => {
  renderer.setSize(main.offsetWidth, main.offsetHeight)
  camera.aspect = main.offsetWidth / main.offsetHeight
  camera.updateProjectionMatrix()
}

// TODO
// This probably could've been handed more sveltely, with 2way binding or something equally silly
export const createScene = (el, dorkMode) => {
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el, alpha: true })

  uniforms['dorkMode'].value = dorkMode
  main = document.querySelector(".above-fold")

  cancelAnimationFrame(frame)
  buildScene()
  resize()
  window.addEventListener('resize', resize)

  renderLoop()
}

const vertexShader = `
attribute vec3 center;
uniform float delta;
varying vec3 vCenter;

void main() {
    vCenter = center;
    gl_Position = projectionMatrix * modelViewMatrix * 
      vec4(
        position.x, 
        position.y, 
        position.z 
        + (position.z / 2.0 * sin(position.x + delta)) 
        + (position.z / 2.0 * cos(position.y + delta)),
        1.0
      );
}
`

const fragmentShader = `
uniform bool dorkMode;

void main() {
  gl_FragColor = dorkMode ? vec4(1.0, 1.0, 1.0 ,1.0) : vec4(0.0, 0.0, 0.0, 1.0);
}
`
