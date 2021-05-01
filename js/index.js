"use strict";
import * as PANOLENS from "panolens";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { Typed } from "typed.js";
import {NPC} from "./NPC";
import {PanoramaItem, current_location} from "./PanoramaItem";

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
    return objects;
}

// Execution starts here

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

init(viewer);

function addALight(pano_obj){
    const aLight = new THREE.AmbientLight(0x404040, 1.2);
    pano_obj.add(aLight);
};

viewer.addUpdateCallback(()=>{
    if(MAIN_NPC.npc_obj){
        // console.log("rotate");
        MAIN_NPC.npc_obj.rotation.y += 0.05;
        // MAIN_NPC.npc_obj.position.y += 0.3;

        // npc_obj.scene.rotation.x += 0.02;
    }
});

// let typed = new Typed('#dialog', {
//     strings: ["First sentence.", "Second sentence."],
//     typeSpeed: 30
// });

// addALight(test_panorama);

const test_panorama = panorams[0].pano_obj;

let loader = new GLTFLoader();
let npc_obj = null;
loader.load("../models/scene.gltf", (gltf)=>{
    npc_obj = gltf.scene;
    npc_obj.scale.set(1,1,1);
    npc_obj.position.set(10, 0, 60);
    npc_obj.name = "NPC";

    for(let panorama of panorams){
        let clone = Object.assign(Object.create(Object.getPrototypeOf(npc_obj)), npc_obj)
        panorama.pano_obj.add( clone );
    }
});


// viewer.addUpdateCallback(function(){
//     if(npc_obj){
//         npc_obj.scene.rotation.y += 0.05;
//         // npc_obj.scene.rotation.x += 0.02;
//     }
// });




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