import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water2.js'
import * as soundbox from './soundbox.js';
import { environment } from './environment.js';
import { character } from './character.js';
import { config } from './config.js';
import { map } from './map.js';



let infoBubble = document.querySelector("#infoBubble")
let fireMeshs = [];
let currentFireFrame = 0
let frameCount = 0;
let textures = [];


document.querySelectorAll('.configButtons').forEach(button => {
    button.addEventListener('click', () => {
        config.currentGraphics = button.getAttribute('id')
        document.querySelectorAll('.configButtons').forEach(btn => {
            btn.classList.remove('selected')
        });
        button.classList.add('selected')
    });
});

document.querySelector('#startButton').addEventListener('click', () => {
    environment.fullSreenRequest()
    document.querySelector('#mainMenu').style.setProperty('display', 'none');
    document.querySelector('#loadingScreen').style.setProperty('display', 'flex');
    setTimeout(() => {
        init()
    }, 2000);
});

document.querySelector('#loadingButton').addEventListener('click', () => {
    document.querySelector('#loadingScreen').style.opacity = 0
    document.querySelector('#loadingScreen').style.visibility = 'hidden'
    document.querySelector('#modalContainer').style.setProperty('display', 'flex');
});


document.querySelector("#fullscreenButton").addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        environment.fullSreenRequest()
    }
});

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.querySelector('#phoneKeys').classList.remove('hidden')
    document.querySelector('#phoneButtons').classList.remove("hidden")
    config.isUserPhone = true
} else {
    document.querySelector('#desktopKeys').classList.remove('hidden')
}




function init() {

    let movingButtons = document.querySelectorAll('.movingButton')
    let cameraButtons = document.querySelectorAll('.cameraButton')

    config.updateLoadingBar(10)
    soundbox.play('ambiance', true)
    soundbox.setVolume('ambiance', 0.20)

    environment.renderer.setSize(window.innerWidth, window.innerHeight);
    environment.renderer.setPixelRatio(window.devicePixelRatio * config.graphics[config.currentGraphics].resolutionRatio);
    environment.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    environment.renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(environment.renderer.domElement);
    config.updateLoadingBar(20)

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    environment.scene.add(ambientLight);
    if (config.currentGraphics != "potato") {
        environment.exrLoader.load(config.isUserPhone ? 'src/3d/fullmoon-lite.exr' : 'src/3d/fullmoon.exr', (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.mapping = THREE.EquirectangularReflectionMapping;
            environment.scene.background = texture;
            environment.scene.environment = texture;
        });
    }


    config.updateLoadingBar(30)
    environment.gltfLoader.load('src/3d/world.glb',
        (gltf) => {
            config.updateLoadingBar(40)
            character.entity = gltf.scene.getObjectByName('personnage');
            environment.scene.add(gltf.scene.getObjectByName('Scene'));
            environment.scene.traverse((child) => {
                map.objects.push(child)
            });
            config.updateLoadingBar(50)
            map.objects.forEach(object => {
                if (object.name.startsWith('collider')) {
                    map.colliders.push(object);
                }

                object.children.forEach(instance => {
                    if (instance.name.startsWith('collider')) {
                        map.colliders.push(instance);
                    }
                });
            });
            config.updateLoadingBar(60)
            character.direction.copy(character.entity.getWorldDirection(new THREE.Vector3()));
            environment.camera.position.set(character.entity.position.x, character.entity.position.y + 1, character.entity.position.z);
            environment.updateCameraPosition(character, config);
            config.updateLoadingBar(70)
            map.surface = gltf.scene.getObjectByName('Landscape');
            map.surface.material.roughness = 1;
            map.interestPoints.push(gltf.scene.getObjectByName('Skills'));
            map.interestPoints.push(gltf.scene.getObjectByName('Coordonnées'));
            map.interestPoints.push(gltf.scene.getObjectByName('Projets'));
            map.interestPoints.push(gltf.scene.getObjectByName('Parcours'));
            let river = gltf.scene.getObjectByName('river');
            config.updateLoadingBar(80)
            const loader = new THREE.TextureLoader();
            const waterGeometry = new THREE.PlaneGeometry(0.8, 1.91, 1, 3);
            const waterRiver = new Water(waterGeometry, {
                scale: 1,
                flowDirection: new THREE.Vector2(1, 1),
                textureWidth: config.graphics[config.currentGraphics].waterResolution,
                textureHeight: config.graphics[config.currentGraphics].waterResolution,
                normalMap0: loader.load('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg'),
                normalMap1: loader.load('https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg'),
                flowSpeed: 0.01,
                reflecivity: config.graphics[config.currentGraphics].waterReflection,
            });
            config.updateLoadingBar(90)
            waterRiver.position.copy(river.position);
            waterRiver.position.y += 0.04;
            waterRiver.rotation.x = Math.PI * - 0.5;
            config.updateLoadingBar(100)
            gltf.scene.getObjectByName('Scene').remove(river);
            gltf.scene.getObjectByName('Scene').add(waterRiver);


            for (let i = 0; i <= 95; i++) {
                const texture = loader.load(`src/img/fire/fire-${i}.png`);
                textures.push(new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.AdditiveBlending  }));
            }
            fireMeshs = [
                gltf.scene.getObjectByName('fire1'),
                gltf.scene.getObjectByName('fire2'),
                gltf.scene.getObjectByName('fire3')
            ]
            setTimeout(() => {
                document.querySelector('#loadingProgress').style.setProperty('display', 'none');
                document.querySelector('#loadingButton').style.setProperty('display', 'block');
            }, 5000);

        },
        null,
        (error) => {
            console.error(error);
        });


    window.addEventListener('keydown', (event) => {
        if (character.keys.hasOwnProperty(event.key)) {
            character.keys[event.key] = true;
            character.isMoving = true
        } else if ((event.key === 'e' || event.key === 'Control') && character.nearestObject) {
            environment.interaction(character)
        }
    });

    window.addEventListener('keyup', (event) => {
        if (character.keys.hasOwnProperty(event.key)) {
            character.keys[event.key] = false;
            character.isMoving = false
            for (const key in character.keys) {
                if (character.keys[key] === true) {
                    character.isMoving = true
                    break;
                }
            }
            if (!character.isMoving) {
                soundbox.stop('pas')
            }
        }
    });

    window.addEventListener('mousedown', (event) => {
        character.isMouseDown = true;
        character.mouseX = event.clientX;
        event.preventDefault();
    });

    window.addEventListener('mouseup', () => {
        character.isMouseDown = false;
    });

    window.addEventListener('mousemove', (event) => {
        if (character.isMouseDown) {
            const deltaX = event.clientX - character.mouseX;
            character.mouseX = event.clientX;
            character.rotate(deltaX * config.xRotationSensibility);
        }
    });

    document.querySelector('#cross').addEventListener('click', () => {
        document.querySelector('#sign').style.setProperty('display', 'none');
        if (character.nearestObject) {
            soundbox.play("close")
            character.canMove = true
            document.getElementById(character.nearestObject).style.setProperty('display', 'none')
        }
    });

    document.querySelector('#EECross').addEventListener('click', () => {
        document.querySelector('#easterEggs').style.display = "none";
        document.querySelector('#EEContent').innerHTML = "";
        if (character.nearestObject) {
            soundbox.play("close")
            character.canMove = true
        }
    });

    infoBubble.addEventListener('click', () => {
        environment.interaction(character)
    });

    window.addEventListener('resize', () => {
        environment.renderer.setSize(window.innerWidth, window.innerHeight);
        environment.camera.aspect = window.innerWidth / window.innerHeight;
        environment.camera.updateProjectionMatrix();
    });
    window.addEventListener('orientationchange', () => {
        environment.renderer.setSize(window.innerWidth, window.innerHeight);
        environment.camera.aspect = window.innerWidth / window.innerHeight;
        environment.camera.updateProjectionMatrix();
    });

    movingButtons.forEach(elt => {
        elt.addEventListener('touchstart', (event) => {
            event.preventDefault();
            character.keys[elt.getAttribute('id')] = true;
            character.isMoving = true
        });
    });

    movingButtons.forEach(elt => {
        elt.addEventListener('touchend', (event) => {
            event.preventDefault();
            character.keys[elt.getAttribute('id')] = false;
            character.isMoving = false
            soundbox.stop('pas')
        });
    });



    cameraButtons.forEach(elt => {
        elt.addEventListener('touchstart', (event) => {
            event.preventDefault();
            character.cameraButtonDown = elt.getAttribute('id');
        });
    });

    cameraButtons.forEach(elt => {
        elt.addEventListener('touchend', (event) => {
            event.preventDefault();
            character.cameraButtonDown = null;
        });
    });
}



function animate(timestamp, environmentObject, configObject, mapObject, characterObject) {
    const deltaTime = timestamp - environmentObject.lastFrameTime;
    if (frameCount % 10 === 0) {
        currentFireFrame++;
        if (currentFireFrame > 95) {
            currentFireFrame = 0;
        }
        fireMeshs.forEach((fireMesh) => {
            fireMesh.material = textures[currentFireFrame];
            fireMesh.material.needsUpdate = true;
        });
    }
    frameCount++;
    if (deltaTime >= 1000 / configObject.maxFPS) {

        environment.stats.update()
        environmentObject.lastFrameTime = timestamp;

        const currentTime = performance.now();
        const deltaTimeSeconds = (currentTime - environment.timeSinceLastFrame) / 1000;
        if (character.nearestObject && infoBubble.classList.contains("hidden")) {
            infoBubble.classList.remove("hidden")
            soundbox.play("bubble")
            infoBubble.querySelector('p').innerText = `${config.isUserPhone ? "Appuyez ici pour interagir avec " : "Appuyez sur E ou CTRL pour interagir avec "}"${character.nearestObject}"`
        } else if (character.nearestObject === null) {
            infoBubble.classList.add("hidden")
        }

        if (characterObject.isMoving && characterObject.entity && mapObject) {
            characterObject.move(environmentObject, configObject, mapObject, deltaTimeSeconds);
            mapObject.distanceBetweenObjects(characterObject)
        }
        if (characterObject.cameraButtonDown) {
            if (characterObject.cameraButtonDown === "right") {
                characterObject.rotate(10 * configObject.xRotationSensibility);
            } else {
                characterObject.rotate(-10 * configObject.xRotationSensibility);
            }
        }

        if (characterObject.isMoving || characterObject.isMouseDown || characterObject.cameraButtonDown) {
            environmentObject.updateCameraPosition(characterObject, configObject);
        }
        environmentObject.renderer.render(environmentObject.scene, environmentObject.camera);
        environment.timeSinceLastFrame = currentTime;
    }

    requestAnimationFrame((nextTimestamp) => animate(nextTimestamp, environmentObject, configObject, mapObject, characterObject));
}

requestAnimationFrame((timestamp) => animate(timestamp, environment, config, map, character));