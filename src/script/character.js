import * as THREE from 'three';
import * as soundbox from './soundbox.js';

export const character = {
    direction: new THREE.Vector3(),
    isMoving: false,
    keys: {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        z: false,
        s: false,
        q: false,
        d: false,
    },
    canMove: true,
    isMouseDown: false,
    cameraButtonDown: null,
    mouseX: 0,
    entity: null,
    nearestObject: null,
    signsFound: [],
    eastersEggsFound: [],
    rotate: function (angle) {
        if (this.entity && (this.isMouseDown || this.cameraButtonDown)) {
            this.entity.rotation.y -= angle;
            this.direction.copy(this.entity.getWorldDirection(new THREE.Vector3()));
        }
    },
    move: function (environmentObject, configObject, mapObject, deltaTime) {
        if (this.entity && this.canMove) {
            const moveSpeed = configObject.moveSpeed * deltaTime;

            const moveDirection = new THREE.Vector3();
            if (this.keys.ArrowUp || this.keys.z) {
                soundbox.play('pas', true)
                moveDirection.z = -1;
            }
            if (this.keys.ArrowDown || this.keys.s) {
                soundbox.play('pas', true)
                moveDirection.z = 1;
            }
            if (this.keys.ArrowLeft || this.keys.q) {
                soundbox.play('pas', true)
                moveDirection.x = -1;
            }
            if (this.keys.ArrowRight || this.keys.d) {
                soundbox.play('pas', true)
                moveDirection.x = 1;
            }

            if (moveDirection.length() > 0) {
                moveDirection.normalize();
            }

            moveDirection.multiplyScalar(moveSpeed);
            this.entity.translateX(moveDirection.x);
            this.entity.translateZ(moveDirection.z);
            this.updateYPosition(environmentObject, mapObject);


            if (mapObject.detectCollision(this)) {
                this.entity.translateX(-moveDirection.x);
                this.entity.translateZ(-moveDirection.z);
            }
        }
    },

    updateYPosition: function (environmentObject, mapObject) {
        environmentObject.raycaster.set(new THREE.Vector3(this.entity.position.x, -10, this.entity.position.z), environmentObject.rayDirection);
        const intersects = environmentObject.raycaster.intersectObject(mapObject.surface);
        if (intersects.length > 0) {
            this.entity.position.y = intersects[0].distance - 10;
        }
    }
};