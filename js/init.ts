import {type} from "./functions";
import {NPC} from "./NPC";
import {PanoramaItem} from "./PanoramaItem";
import * as THREE from "three";
import * as PANOLENS from "panolens";

// There is one more (and better) way how to do this
// But it's for fucked nerds
// @ts-ignore
import pano1_url from '../img/pano1.jpg';
// @ts-ignore
import pano2_url from '../img/pano2.jpg';

export function init() : PANOLENS.Viewer {
    const panoDiv: HTMLElement|null = document.getElementById("pano-image");
    const viewer: PANOLENS.Viewer = new PANOLENS.Viewer({
        container: panoDiv,
        output: 'console',
    });

    let objects: {[key: string] : PANOLENS.Panorama;} = {};

    for(let pan of panorams) {
        pan.setViewer(viewer);
        viewer.add( pan.pano_obj );
        objects[pan.name] = pan.pano_obj;
    }
    // init edges
    for(const pan of panorams) {
        for(const {dest, pos} of pan.transition_edges) {

            if(!objects[dest]) {
                console.log(`panorama with name: "${dest}" not exist can't link`)
                continue;
            }

            pan.pano_obj.link( objects[dest], pos );
        }
    }

    const welcome_message: string = "HELL'o fucker!";
    panorams[0].pano_obj.addEventListener( 'load', () => {
        type([welcome_message]);
    });


    return viewer;
}

export const MAIN_NPC = new NPC("steve", "../models/scene.gltf");

export const panorams = [
    new PanoramaItem({
        name: "hall_4f_1b",
        pano_url: pano1_url,
        transition_edges: [{
            dest:"after_cava_4f_1b",
            pos: new THREE.Vector3( 3047.29, -767.20, 3880.51 )
        }],
        enter_look_direction: new THREE.Vector3(4464.09, -738.67, 2113.00),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(20, 0, 40)
        }]
    }),
    new PanoramaItem({
        name: "after_cava_4f_1b",
        pano_url: pano2_url,
        transition_edges: [{
            dest:"hall_4f_1b",
            pos: new THREE.Vector3( -5000.00, -414.86, 131.79 )
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }]
    }),
];