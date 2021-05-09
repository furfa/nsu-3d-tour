import * as THREE from "three";
import * as PANOLENS from "panolens";

export const addALight = (pano_obj: PANOLENS.Panorama) => {
    const aLight : THREE.AmbientLight = new THREE.AmbientLight(0x404040, 2);
    pano_obj.add(aLight);
};

export const addAPointLight = (pano_obj: PANOLENS.Panorama, position: THREE.Vector3) => {
    const pLight = new THREE.PointLight(0xFFFFFF, 1.2);
    pLight.position.set(position.x,position.y,position.z);
    pano_obj.add(pLight);

    // const pLightHelper = new THREE.PointLightHelper(pLight);
    // pano_obj.add(pLightHelper);
};

export const addFloor = (pano_obj: PANOLENS.Panorama) => {

    const geometry = new THREE.PlaneGeometry( 100, 100, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xFFFF00, side: THREE.DoubleSide} );
    material.transparent = true;
    material.opacity = 0.5;
    const plane = new THREE.Mesh( geometry, material );
    plane.position.set(0,-30,0);
    plane.rotation.x = Math.PI / 2;
    pano_obj.add(plane);
    console.log("Floor plane is", plane);
    // debugger;
}

// Calculate coordinates of ellipse dot, by angle
export function calculateViewCoords(angle: number): THREE.Vector3 { // (ellipse movement)
    let a = 30;
    let b = 30;
    return new THREE.Vector3(-b * Math.sin(angle), -30, -a * Math.cos(angle));
}

// Calculate rotation to see dot from pos
export function calculateViewRotation(dot: THREE.Vector3, pos: THREE.Vector3) {
    return Math.atan2(dot.x - pos.x, dot.z - pos.z);
}
