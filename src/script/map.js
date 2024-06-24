import * as THREE from 'three';
export const map = {
    colliders: [],
    interestPoints: [],
    objects: [],
    surface: null,
    detectCollision: function (characterObject) {
        const characterBox = new THREE.Box3().setFromObject(characterObject.entity);
        return this.colliders.some(collider => {
            const objectBox = new THREE.Box3().setFromObject(collider);
            return characterBox.intersectsBox(objectBox);
        });
    },
    distanceBetweenObjects: function (characterObject) {
        let objectName = null
        this.interestPoints.forEach(object => {
            if (Math.sqrt(
                (object.position.x - characterObject.entity.position.x) ** 2 +
                (object.position.z - characterObject.entity.position.z) ** 2
            ) < 0.1) {
                objectName = object.name
            }
        });
        characterObject.nearestObject = objectName;
    },
};