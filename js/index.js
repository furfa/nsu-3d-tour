"use strict";
import * as PANOLENS from "panolens";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {type} from "./functions.ts";

import {NPC} from "./NPC.ts";
import {PanoramaItem} from "./PanoramaItem.ts";

import {init, MAIN_NPC, panorams} from "./init";

// TODO:
// - See: functions.ts
// - Refactor functions.ts file-name
// - Change design

const viewer = init();

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