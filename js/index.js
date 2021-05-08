"use strict";
import {init, MAIN_NPC, panorams} from "./init";

import TWEEN from '@tweenjs/tween.js';

// TODO:
// - Add NPC shape animation (smoothly make NPC bigger)
// - Make dialogues more colorful
// - Refactor functions.ts file-name

const viewer = init();



viewer.addUpdateCallback(() => {
    TWEEN.update();

    if(MAIN_NPC.npc_obj) { // Just for fun

        // EXPERIMENTS WITH MOVEMENT ANIMATION:
        // let angle = viewer.getControl().getAzimuthalAngle();
        // MAIN_NPC.npc_obj.rotation.y += 0.05;
        // let pos = {}
        // let a = 100;
        // let b = 150;
        // pos.y = -20;
        // pos.z = a * Math.cos(-angle);
        // pos.x = b * Math.sin(-angle);
        // MAIN_NPC.npc_obj.position.set(
        //     pos.x, pos.y, pos.z
        // );

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
