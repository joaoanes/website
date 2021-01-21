import * as THREE from 'three';

let scene;
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
const geometry = new THREE.PlaneGeometry(20, 20, 19, 19);
for (var i = 0, l = geometry.vertices.length; i < l; i++) { //TODO EWWWWWWWWWW
    geometry.vertices[i].z = Math.sin(Math.random() * 3.14) + Math.random();
}
let renderer;
let main, counter = 0

export let uniforms = { 'dorkMode': { value: false }, 'uTime': { value: 1 } };

const buildScene = () => {


    var material = new THREE.MeshBasicMaterial({
        color: uniforms['dorkMode'].value ? 0 : 0xffffff,
    });


    geometry.computeFaceNormals();
    geometry.computeVertexNormals();



    const material2 = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: `attribute vec3 center;
    uniform float uTime;
    varying vec3 vCenter;


    void main() {

        vCenter = center;

        gl_Position = projectionMatrix * modelViewMatrix * 
            vec4( position.x , position.y ,  position.z + 0.1+ position.z * (sin(position.x + uTime / 10.0) / 30.0) , 1.0 ) ;

    }
`,
        fragmentShader: `
    uniform bool dorkMode;

			void main() {


				gl_FragColor = dorkMode ? vec4(1.0,1.0,1.0,1.0) : vec4(0.0,0.0,0.0,1.0); ; 

			}`,
        side: THREE.DoubleSide,


    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh)

    // wireframe
    var geo = new THREE.WireframeGeometry(mesh.geometry); // or WireframeGeometry
    var wireframe = new THREE.LineSegments(geo, material2);
    scene.add(wireframe);


    camera.position.z = 2.5;
    camera.rotation.x = 1.5;


}

let frame

const animate = () => {
    counter = (counter + 1) % 7

    if (counter === 0) {
        uniforms.uTime.value += 1
    }
    frame = requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

const resize = () => {
    renderer.setSize(main.offsetWidth, main.offsetHeight)
    camera.aspect = main.offsetWidth / main.offsetHeight;
    camera.updateProjectionMatrix();
};

export const createScene = (el, dorkMode) => {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el, alpha: true });

    uniforms['dorkMode'].value = dorkMode
    main = document.querySelector(".above-fold")
    cancelAnimationFrame(frame)
    buildScene()
    resize();
    animate();
}

window.addEventListener('resize', resize);
