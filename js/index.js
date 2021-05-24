"use strict";
import "../css/style.css";
import { init, MAIN_NPC } from "./init";

import TWEEN from '@tweenjs/tween.js';
import { calculateViewCoords, calculateViewRotation } from "./SceneFunctions";

// TODO:
//  (globally)
//  - make for async
//  - debug fbx loader
//  - Make dialogues more colorful
//  - add configs (see init.ts)
//  (init.ts):
//  - Rewrite hardcode to reading configs
//  - Расширить интерфейс окна для добавления новых проперти

// style.

const viewer = init();



viewer.addUpdateCallback(() => {
    TWEEN.update();
});

