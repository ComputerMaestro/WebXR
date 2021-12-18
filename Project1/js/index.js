import * as THREE from '../node_modules/three/src/three.js';
// import {
//   OrbitControls
// } from '../node_modules/three/examples/ksm/controls/OrbitControls.js';

class App {
  constructor() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Initializing camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 5);

    // Initializing scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
		this.scene.add(ambient);

    const light = new THREE.DirectionalLight();
    light.position.set( 0.2, 1, 1);
    this.scene.add(light);

    // initializing renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    // Adding lathe object
    const points = [];
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
    }
    const geometry = new THREE.OctahedronGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: 0x34d8eb
    });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube); // by default (0,0,0)

    this.objects = {
      cube: cube
    };

    this.render();

    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {

  }

  render() {
    requestAnimationFrame(this.render.bind(this));

    this.objects.cube.rotation.x += 0.01;
    this.objects.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }
}

export {
  App
};
