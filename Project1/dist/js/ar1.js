import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import {XRButton} from './XRButton.js';

class App {
    constructor(){
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0,0,5);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#aaaaaa');

        const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
        this.scene.add(ambient);

        const light = new THREE.DirectionalLight();
        light.position.set( 0.2, 1, 1);
        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        this.initializeScene();
        this.setupXR();
        this.render();
    }

    initializeScene() {
        const geometryOcta = new THREE.OctahedronGeometry();
        const materialOcta = new THREE.MeshStandardMaterial({ color: 0x78e4fa });
        const octahedron = new THREE.Mesh(geometryOcta, materialOcta);
        this.scene.add(octahedron); // by default (0,0,0)

        this.objects = { octahedron: octahedron };
    }

    setupXR(){
        this.renderer.xr.enabled = true;
        const ARButton = new XRButton(this.renderer);
    }

    render(){
        requestAnimationFrame(this.render.bind(this));

        this.objects.octahedron.rotation.x += -0.01;
        this.objects.octahedron.rotation.y += -0.01;

        this.renderer.render(this.scene, this.camera);
    }
}

export {App};
