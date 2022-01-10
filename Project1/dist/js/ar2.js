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

        this.reticle = new THREE.Mesh(
            new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX( -Math.PI/2 ),
            new THREE.MeshBasicMaterial()
        );

        this.reticle.matrixAutoUpdate = false;  // so that we can manually update position
        this.reticle.visible = false;
        this.scene.add(this.reticle);
    }

    setupXR(){

        const self = this;

        this.hitTestSourceRequested = false;
        this.hitTestSource = null;

        const btn = new XRButton(this.renderer, {requiredFeatures: ['hit-test']});

        this.renderer.setAnimationLoop( self.render.bind(self) );
    }

    requestHitTestSource() {
        const self = this;

        const session = this.renderer.xr.getSession();  // get current session

        // get viewers reference space
        session.requestReferenceSpace('viewer').then(function(referenceSpace){
            // then with that reference space get hit test source
            session.requestHitTestSource({space: referenceSpace}).then(
                function(source){
                    self.hitTestSource = source;
                }
            );
        });

        // restore defaults once session ends
        session.addEventListener('end', function(){
            self.hitTestSourceRequested = false;
            self.hitTestSource = null;
            self.referenceSpace = null;
        });

        this.hitTestSourceRequested = true;
    }

    getHitTestResults(frame) {
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);

        if(hitTestResults.length) { // if lenght is more than zero
            const referenceSpace = this.renderer.xr.getReferenceSpace();
            const hit =  hitTestResults[0]; // take only first hit test result
            const pose = hit.getPose(referenceSpace);   // get pose for the reference space

            // now we got pose(position and orientation)
            // so we can set the reticle position and orientation as well
            this.reticle.visible = true;    // make reticle visible
            // using Matrix4.fromArray here because the webgl matrix by default is an array (32 = length)
            // we need to convert it to THREE js array
            this.reticle.matrix.fromArray(pose.transform.matrix);
        } else {
            this.reticle.visible = false;
        }
    }

    render(timestamp, frame){
        if(frame) {
            if(this.hitTestSourceRequested === false)
            {
                console.log('entered request hit test');
                this.requestHitTestSource()
            }

            if(this.hitTestSource) this.getHitTestResults(frame);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

export {App};
