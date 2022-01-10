import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { XRButton } from './XRButton.js';

class App {
    constructor(){
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

        this.scene = new THREE.Scene();

        const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff);
        this.scene.add(ambient);

        const light = new THREE.DirectionalLight();
        light.position.set( 0.2, 1, 1);
        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        container.appendChild(this.renderer.domElement);

        this.initializeScene();
        this.setupXR();
    }

    initializeScene() {
        this.geometry = new THREE.OctahedronGeometry(0.06);
        this.meshes = [];
    }

    setupXR(){

        const self = this;
        let controller;

        function onSelect() {
            const geoOcta = new THREE.OctahedronGeometry(0.06);
            const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
            const mesh = new THREE.Mesh( self.geometry, material );
            mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
            mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
            self.scene.add( mesh );
            self.meshes.push( mesh );

            console.log(mesh);
        }

        const btn = new XRButton(this.renderer);

        controller = this.renderer.xr.getController(0);
        console.log(controller);
        controller.addEventListener('select', onSelect, {once: true});
        this.scene.add(controller);

        this.renderer.setAnimationLoop( this.render.bind(this) );
    }

    render(){
        this.renderer.render(this.scene, this.camera);
    }
}

export {App};
