import * as PANOLENS from "panolens"
import * as THREE from "three"

import pano1_url from '../img/pano1.jpg'
import pano2_url from '../img/pano2.jpg';

let current_location = "";

class PanoramaItem{
    constructor(name, pano_url, transition_edges=[]){
        this.name = name;
        this.pano_url = pano_url; 
        this.transition_edges = transition_edges;
        this.pano_obj = new PANOLENS.ImagePanorama(this.pano_url);

        this.pano_obj.addEventListener('enter', () => {
            current_location = this.name;
            console.log(`entering "${current_location}"`);
        });
    }
}

const panorams = [
    new PanoramaItem("hall_4f_1b", pano1_url, 
        [{
            dest:"after_cava_4f_1b", 
            pos: new THREE.Vector3( 3047.29, -767.20, 3880.51 )
        }]
    ),
    new PanoramaItem("after_cava_4f_1b", pano2_url,
    [{
        dest:"hall_4f_1b", 
        pos: new THREE.Vector3( -5000.00, -414.86, 131.79 ) 
    }]
    ),
];

const init = (viewer) => {
    let objects = {}; 

    for(const pan of panorams){
        viewer.add( pan.pano_obj );
        objects[pan.name] = pan.pano_obj;
    }
    // init edges
    for(const pan of panorams){
        for(const {dest, pos} of pan.transition_edges){

            if(!objects[dest]){
                console.log(`panorama with name: "${dest}" not exist can't link`)
                continue;
            }

            pan.pano_obj.link( objects[dest], pos );
        }
    }
    return objects;
}

const panodiv = document.getElementById("pano-image");
const viewer = new PANOLENS.Viewer({
    container: panodiv,
    output: 'console',
});

init(viewer);



// console.log(pano1_url);
const panorama1 = new PANOLENS.ImagePanorama(pano1_url);

// viewer.add( panorama1 );
// const panorama2 = new PANOLENS.ImagePanorama(pano2_url);
// viewer.add( panorama2 );

// panorama1.link( panorama2, new THREE.Vector3( 4116.60, -1408.85, -5000.00 ) );
// panorama2.link( panorama1, new THREE.Vector3( -5000.00, -414.86, 131.79 ) );
