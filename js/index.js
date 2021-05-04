"use strict";
import * as PANOLENS from "panolens";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {type} from "./functions";

import {NPC} from "./NPC";
import {PanoramaItem} from "./PanoramaItem";

import pano1_url from '../img/pano1.jpg';
import pano2_url from '../img/pano2.jpg';

const init = (viewer) => {
    let objects = {};

    for(let pan of panorams){
        pan.setViewer(viewer);
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

    const welcome_message = "HELL'o fucker!";
    panorams[0].pano_obj.addEventListener( 'load', () => {
        type([welcome_message]);
    });


    return objects;
}

const MAIN_NPC = new NPC("steve", "../models/scene.gltf");

const panorams = [
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

const panodiv = document.getElementById("pano-image");
const viewer = new PANOLENS.Viewer({
    container: panodiv,
    output: 'console',
});

// type([""]);
init(viewer);

viewer.addUpdateCallback(()=>{
    if(MAIN_NPC.npc_obj){
        // console.log("rotate");
        MAIN_NPC.npc_obj.rotation.y += 0.05;
        // MAIN_NPC.npc_obj.position.y += 0.3;

        // npc_obj.scene.rotation.x += 0.02;
    }
});



const test_panorama = panorams[0].pano_obj;


/*
// Add control button

let controlItemCube = {
  style: {
    backgroundImage: 'url(http://i40.tinypic.com/1531w79.jpg)'
  },
  
  onTap: function(){
    viewer.tweenControlCenterByObject( cube );
    console.log("TAP");
  }
};
viewer.appendControlItem(controlItemCube);
*/