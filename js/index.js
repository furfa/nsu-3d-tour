"use strict";
import {init, MAIN_NPC, panorams} from "./init";

import TWEEN from '@tweenjs/tween.js';
import {calculateViewCoords, calculateViewRotation} from "./SceneFunctions";

// TODO:
// - Make dialogues more colorful
// - add configs

const viewer = init();


viewer.addUpdateCallback(() => {
    TWEEN.update();

    if(MAIN_NPC.npc_obj) { // Just for try something

        // Steve mirroring rotation:
        let angle = viewer.getControl().getAzimuthalAngle();
        let dot = calculateViewCoords(angle);
        MAIN_NPC.npc_obj.rotation.y = calculateViewRotation(dot, MAIN_NPC.npc_obj.position);

        // Just rotation:
        // MAIN_NPC.npc_obj.rotation.y += 0.05;
        // MAIN_NPC.npc_obj.position.y += 0.3;
        // npc_obj.scene.rotation.x += 0.02;
    }
});

const test_panorama = panorams[0].pano_obj;

// Add control button

// let controlItemCube = {
//   style: {
//     backgroundImage: 'url(http://i40.tinypic.com/1531w79.jpg)'
//   },
//
//   onTap: function() {
//     // viewer.tweenControlCenterByObject( cube );
//     console.log("TAP");
//   }
// };
// viewer.appendControlItem(controlItemCube);

// GLobal
