"use strict";
import * as PANOLENS from "panolens";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import pano1_url from '../img/pano1.jpg';
import pano2_url from '../img/pano2.jpg';

let current_location = "";

class NPC{
    constructor(name, path){
        this.name = name;
        this.npc_obj = null;
        this.path = path;
        this.loader = null;
        this.panoramas = [];
    }

    load(){
        if(this.npc_obj) return;

        console.log("loading npc model");
        console.log(this.panoramas);

        if(this.path.endsWith(".gltf")) this.load_GLTF();
        else console.log("Can't load npc model");
    }

    load_GLTF(){
        this.loader = new GLTFLoader();
        this.loader.load(this.path, (gltf)=>{
            this.npc_obj = gltf.scene;
            this.npc_obj.scale.set(1,1,1);
            this.npc_obj.position.set(20, 0, 40);
            this.npc_obj.name = `npc_${this.name}`;

            for(let pano of this.panoramas) pano.add(this.npc_obj);
        });
    }
    move(vec){
        if(!this.npc_obj) return;
        this.npc_obj.position.set(vec);
    }
    addOnPanorama(pano_obj){
        this.panoramas.push(pano_obj);
    }
}

class PanoramaItem{
    constructor({name,
                 pano_url,
                 transition_edges=[],
                 enter_look_direction = new THREE.Vector3(0,0,0),
                 npc_list
                } = {}){
        this.viewer;

        this.name = name;
        this.pano_url = pano_url; 
        this.transition_edges = transition_edges;
        this.pano_obj = new PANOLENS.ImagePanorama(this.pano_url);
        this.enter_look_direction = enter_look_direction;
        
        this.first_look = true;
        this.npc_list = npc_list;
        for(let {npc, pos} of this.npc_list) npc.addOnPanorama(this.pano_obj);

        addALight(this.pano_obj);

        this.pano_obj.addEventListener('enter', () => {
            current_location = this.name;
            console.log(`entering "${current_location}"`);

            if(this.first_look){
                this.viewer.tweenControlCenter(this.enter_look_direction, 0);
                console.log(`Looking at ${this.enter_look_direction}`)
                this.first_look = false;
            }

            this.moveNPCs();
        });

        this.pano_obj.addEventListener( 'click', ( event ) => {

            if ( event.intersects.length > 0 ) {
              console.log(event);
        
              let intersect = event.intersects[ 0 ].object;
        
              if ( !(intersect instanceof PANOLENS.Infospot) && intersect.material ){
                console.log("You clicked on npc !!!");
                console.log(MAIN_NPC);
              }
            }
        } );

    }

    setViewer(viewer){
        this.viewer = viewer;
    }

    loadNPCs(){
        for(let {npc, pos} of this.npc_list){
            npc.load();
        }
    }

    moveNPCs(){
        for(let {npc, pos} of this.npc_list){
            npc.move(pos);
        }
    }
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

const init = (viewer) => {
    let objects = {}; 

    for(let pan of panorams){
        pan.setViewer(viewer);
        viewer.add( pan.pano_obj );
        pan.loadNPCs();

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

function addALight(pano_obj){
    const aLight = new THREE.AmbientLight(0x404040, 1.2);
    pano_obj.add(aLight);
};

viewer.addUpdateCallback(()=>{
    if(MAIN_NPC.npc_obj){
        // console.log("rotate");
        MAIN_NPC.npc_obj.rotation.y += 0.05;
        // npc_obj.scene.rotation.x += 0.02;
    }
});

// addALight(test_panorama);

// const test_panorama = panorams[0].pano_obj;

// let loader = new GLTFLoader();
// let npc_obj = null;
// loader.load("../models/scene.gltf", (gltf)=>{
//     npc_obj = gltf;
//     npc_obj.scene.scale.set(1,1,1);
//     npc_obj.scene.position.set(10, 0, 60);
//     npc_obj.scene.name = "NPC";
//     test_panorama.add(npc_obj.scene);
// });


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