import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';


class XRButton {
    constructor(renderer, opton){
        this.renderer = renderer;

        if('xr' in navigator) {
            const button = document.createElement('button');
            button.style.display = 'none';
            button.style.height = '40px';

            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                supported ? this.showEnterAR(button) : this.showWebXRNotFound(button);
            });

            document.body.appendChild(button);
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

    showEnterAR(button) {
        let currentSession = null;

        this.stylizeElement(button, true);

        button.style.display = '';
        button.style.cursor = 'pointer';

        button.onmouseenter = function(){
            button.textContent = (currentSession === null) ? 'ENTER AR' : 'EXIT AR';
            button.style.opacity = '1';
        };

        button.onmouseleave = function() {
            button.textContent = 'AR Button';
            button.style.opacity = '0.5';
        };

        const self = this;
        function onSessionStarted(session) {
            session.addEventListener('end', onSessionEnded);

            self.renderer.xr.setReferenceSpaceType( 'local' );
            self.renderer.xr.setSession(session);
            self.stylizeElement(button, false);

            button.textContent = 'EXIT XR';

            currentSession = session;

            if (self.onSessionStart !== undefined && self.onSessionStart !== null) self.onSessionStart();
        }

        function onSessionEnded() {
            currentSession.removeEventListener('end', onSessionEnded);

            self.stylizeElement(button, true);
            button.textContent = 'ENTER XR';

            currentSession = null;

            if (self.onSessionEnd !== undefined && self.onSessionEnd !== null) self.onSessionEnd();
        }

        button.onclick = function() {
            if(currentSession === null) {
                navigator.xr.requestSession('immersive-ar').then(onSessionStarted);
                self.moveButtonToCorner(button);
            } else {
                currentSession.end();
                self.moveButtonToCenter(button);
            }
        }
    }

    showWebXRNotFound(button) {
        this.disableButton(button);

        button.style.display = '';
        button.style.width = '100%';
        button.style.right = '0px';
        button.style.bottom = '.5vh';
        button.style.border = '';
        button.style.borderRadius = '3px';
        button.style.opacity = '1';
        button.style.fontSize = '13px';
        button.textContent = 'AR NOT SUPPORTED';
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
        element.style.bottom = '50%';
        element.style.transform = 'translate(0, 50%)';
        element.style.right = '50%';
        element.style.transform = 'translate(0, 50%)';
        element.style.width = '200px';
        element.style.borderRadius = '3px';
        element.style.fontSize = '30px';
        element.style.background = (green) ? 'rgba(20, 150, 80, 1)' : 'rgba(180, 20, 20, 1)';
        element.style.transitionDuration = '300ms';
        element.style.transitionProperty = 'bottom, right, width, height, font-size';
        element.style.zIndex = '999';
    }

    moveButtonToCorner(button) {
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.width = '80px';
        button.style.fontSize = '12px';
    }

    moveButtonToCenter(button) {
        button.style.bottom = '50%';
        button.style.right = '50%';
        button.style.width = '200px';
        button.style.fontSize = '30px';
    }
};

export {XRButton};
