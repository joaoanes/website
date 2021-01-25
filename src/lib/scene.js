import * as THREE from 'three';
export let uniforms = { 'dorkMode': { value: false }, 'delta': { value: 1 } };

//TODO: singletonsssssssssssssssssss
let scene;
let renderer;
let main, counter = 0

let frame
let gridGeometry
let camera

const buildScene = () => {
  //TODO: Consider disposing of previous scene
  if (!gridGeometry) {
    gridGeometry = new THREE.PlaneGeometry(20, 20, 19, 19);
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    gridGeometry.vertices = gridGeometry.vertices.map(
      ({ x, y, z }) => ({ x, y, z: Math.random() * 2 })
    )
  }
  camera.position.z = 2.5;
  camera.rotation.x = 1.5;

  var gridMaterial = new THREE.MeshBasicMaterial({
    color: uniforms['dorkMode'].value ? 0 : 0xffffff,
  });

  const wireframeMaterial = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
  });

  var gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
  scene.add(gridMesh)

  var wireGeometry = new THREE.WireframeGeometry(gridGeometry);
  var wireMesh = new THREE.LineSegments(wireGeometry, wireframeMaterial);
  scene.add(wireMesh);
}

const renderLoop = () => {
  counter = (counter + 1) % 7

  if (counter === 0) {
    uniforms.delta.value += 1
  }

  frame = requestAnimationFrame(renderLoop);
  renderer.render(scene, camera);
};

const resize = () => {
  renderer.setSize(main.offsetWidth, main.offsetHeight)
  camera.aspect = main.offsetWidth / main.offsetHeight;
  camera.updateProjectionMatrix();
};

// TODO
// This probably could've been handed more sveltely, with 2way binding or something equally silly
export const createScene = (el, dorkMode) => {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el, alpha: true });

  uniforms['dorkMode'].value = dorkMode
  main = document.querySelector(".above-fold")

  cancelAnimationFrame(frame)
  buildScene()
  resize();
  window.addEventListener('resize', resize);

  renderLoop();
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
         + (2.0 * sin(position.x + delta / 10.0) / 30.0) 
         + (4.0 * cos(position.y + delta / 10.0) / 30.0), 
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
