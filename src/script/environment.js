import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js';
import Stats from 'three/addons/libs/stats.module.js';
import * as soundbox from './soundbox.js';


export const environment = {
    scene: new THREE.Scene(),
    LODScene: null,
    camera: new THREE.PerspectiveCamera(50, window.innerHeight < window.innerWidth ? window.innerWidth / window.innerHeight : window.innerHeight / window.innerWidth, 0.001, 1000),
    renderer: new THREE.WebGLRenderer({ antialias: false }),
    rgbeLoader: new RGBELoader(),
    gltfLoader: new GLTFLoader(),
    dracoLoader: new DRACOLoader(),
    exrLoader: new EXRLoader(),
    stats: new Stats(),
    modifier: new SimplifyModifier(),
    lod: new THREE.LOD(),
    tempVector: new THREE.Vector3(),
    raycaster: new THREE.Raycaster(),
    rayDirection: new THREE.Vector3(0, 1, 0),
    timeSinceLastFrame: 0,
    lastFrameTime: 0,
    updateCameraPosition: function (characterObject, configObject) {
        if (characterObject.entity) {
            this.camera.position.copy(characterObject.entity.position);
            this.camera.position.y += configObject.cameraHeight;
            this.camera.lookAt(
                characterObject.entity.position.x + characterObject.direction.x,
                characterObject.entity.position.y + characterObject.direction.y,
                characterObject.entity.position.z + characterObject.direction.z
            );
        }
    },
    fullSreenRequest: function () {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    },
    interaction: function (characterObject) {
        if (characterObject.nearestObject === 'Coordonnées' || characterObject.nearestObject === 'Skills' || characterObject.nearestObject === 'Parcours' || characterObject.nearestObject === 'Projets') {
            if (!characterObject.signsFound.includes(characterObject.nearestObject)) {
                characterObject.signsFound.push(characterObject.nearestObject)
                document.querySelector('#signsNumber').innerText = characterObject.signsFound.length
                if (characterObject.signsFound.length === 4) {
                    soundbox.play("success")
                    document.querySelector("#signCount").style.color = "green"
                }
            }
            document.querySelector('#signsNumber').innerText = characterObject.signsFound.length
            characterObject.canMove = false
            soundbox.play("open")
            sign.style.setProperty('display', 'flex');
            document.getElementById(characterObject.nearestObject).style.setProperty('display', 'flex')

        } else {
            if (!characterObject.eastersEggsFound.includes(characterObject.nearestObject)) {
                characterObject.eastersEggsFound.push(characterObject.nearestObject)
                document.querySelector('#EENumber').innerText = characterObject.eastersEggsFound.length
                if (characterObject.eastersEggsFound.length === 5) {
                    soundbox.play("success")
                    document.querySelector("#EECount").style.color = "green"
                }
            }
        }
    }
};

environment.dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.165/examples/jsm/libs/draco/');
environment.gltfLoader.setDRACOLoader(environment.dracoLoader);
environment.dracoLoader.preload();