"use strict";
import {init, MAIN_NPC} from "./init";

import TWEEN from '@tweenjs/tween.js';
import {calculateViewCoords, calculateViewRotation} from "./SceneFunctions";

// TODO:
// - make for async
// - debug fbx loader
// - Make dialogues more colorful
// - add configs (see init.ts)

const viewer = init();


viewer.addUpdateCallback(() => {
    TWEEN.update();

    if(MAIN_NPC.npc_obj) { // Just for try something

        // Steve mirroring rotation:
        let angle = viewer.getControl().getAzimuthalAngle();
        let dot = calculateViewCoords(angle);
        MAIN_NPC.npc_obj.rotation.y = calculateViewRotation(dot, MAIN_NPC.npc_obj.position);

    }
});

