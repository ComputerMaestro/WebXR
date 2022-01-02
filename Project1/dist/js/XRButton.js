import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';


class XRButton {
    constructor(renderer){
        this.renderer = renderer;

        if('xr' in navigator) {
            const button = document.createElement('button');
            button.style.display = 'none';
            button.style.height = '40px';
            document.body.appendChild(button);

            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                supported ? this.showEnterVR(button) : this.showWebXRNotFound(button);
            });
        } else {
            const message = document.createElement('a');
            if(window.isSecureContext === false) {
                message.href = document.location.href.replace(/^http:/, 'https:');
                message.innerHTML = 'WEBXR NEEDS HTTPS';
            } else {
                message.href = 'https://immersiveweb.dev';
                message.innerHTML = 'WEBXR NOT AVAILABLE';
            }
        }
    }

    showEnterVR(button) {
        let currentSession = null;

        this.stylizeElement(button, true);

        button.style.display = '';
        button.style.right = '20px';
        button.style.width = '80px';
        button.style.cursor = 'pointer';

        button.onmouseenter = function(){
            button.style.fontSize = '12px';
            button.textContent = (currentSession === null) ? 'ENTER VR' : 'EXIT VR';
            button.style.opacity = '1';
        };

        button.onmouseleave = function() {
            button.style.fontSize = '30px';
            button.textContent = 'VR Button';
            button.style.opacity = '0.5';
        };

        const self = this;
        function onSessionStarted(session) {
            session.addEventListener('end', onSessionEnded);

            self.renderer.xr.setSession(session);
            self.stylizeElement(button, false);

            button.textContent = 'EXIT XR';

            currentSession = session;
        }

        function onSessionEnded() {
            currentSession.removeEventListener('end', onSessionEnded);

            self.stylizeElement(button, true);
            button.textContent = 'ENTER XR';

            currentSession = null;
        }

        button.onclick = function() {
            if(currentSession === null) {
                const sessionInit = {optionalFeatures: ['local-floor', 'bounded-floor']};
                navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStarted);
            } else {
                currentSession.end();
            }
        }
    }

    showWebXRNotFound(button) {
        this.disableButton(button);

        button.style.display = '';
        button.style.width = '100%';
        button.style.right = '0px';
        button.style.bottom = '0px';
        button.style.border = '';
        button.style.opacity = '1';
        button.style.fontSize = '13px';
        button.textContent = 'VR NOT SUPPORTED';
    }

    disableButton(button) {
        button.style.cursor = 'auto';
        button.style.opacity = '0.5';

        button.onmouseenter = null;
        button.onmouseleave = null;

        button.onclick = null;
    }

    stylizeElement(element, green=true) {
        element.style.position = 'absolute';
        element.style.bottom = '20px';
        element.style.right = '20px';
        element.style.background = (green) ? 'rgba(20, 150, 80, 1)' : 'rgba(180, 20, 20, 1)';
    }
};

export {XRButton};
