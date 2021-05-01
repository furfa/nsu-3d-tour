import * as THREE from "three";
import * as PANOLENS from "panolens";

export const addALight = (pano_obj) => {
    const aLight = new THREE.AmbientLight(0x404040, 1.2);
    pano_obj.add(aLight);
};