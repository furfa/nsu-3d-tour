import * as THREE from "three";
import * as PANOLENS from "panolens";

export const addALight = (pano_obj: PANOLENS.Panorama) => {
    const aLight : THREE.AmbientLight = new THREE.AmbientLight(0x404040, 2);
    pano_obj.add(aLight);
};