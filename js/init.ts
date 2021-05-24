import { typeDialog } from "./TypedTools";
import {getReplicasByConfig, NPC, NPCReplicaInterface} from "./NPC";
import { Food } from "./Food";
import { PanoramaItem } from "./PanoramaItem";
import { StatusBar } from "./StatusBar";
import * as THREE from "three";
import * as PANOLENS from "panolens";
import * as dat from 'dat.gui';


// import panorams
const pano1_url:string              = require('../img/pano1.jpg').default;
const pano2_url:string              = require('../img/pano2.jpg').default;
const pano_wellcome_url:string      = require('../img/pano_wellcome.jpg').default;
const pano1f2b_entry_url:string     = require('../img/1f2b_entry.jpg').default;
const pano4_elev_url:string         = require('../img/4_elev.jpg').default;
const pano4_cava_new_url:string     = require('../img/4_cava_new.jpg').default;
const pano4_bookshare_url:string    = require('../img/4_bookshare.jpg').default;
const pano4_kbrd_url:string         = require('../img/4_kbrd.jpg').default;
const pano3_near_3107_url:string    = require('../img/3_near_3107.jpg').default;
const pano3_cafeteria_url:string    = require('../img/3_cafeteria.jpg').default;
const pano3_cafeteria_galery_url:string = require('../img/3_cafeteria_galery.jpg').default;
//3_cafeteria_galery
const pano_prev_dickanat_url:string = require('../img/pano_prev_dickanat.jpg').default;
const pano_dickanat_url:string      = require('../img/pano_dickanat.jpg').default;

const steve_url:string         = '../models/steve/scene.gltf';// require('../models/steve/scene.gltf').default;
const apple_url:string         = '../models/apple/scene.gltf';// require('../models/apple/scene.gltf').default;
const sandwich_url:string      = '../models/sandwich/sandwich.gltf';

declare global{
    interface Window{
        DEBUG:boolean;
        GUI: dat.GUI;
        PANORAMS : {[key: string] : PANOLENS.Panorama;};
        NPCS : {[key: string] : NPC;};
    }
}

window.PANORAMS = {};
window.NPCS = {};

function initWelcomeScreen(viewer, nextPano) {
    console.log('loading welcome screen');

    let element:HTMLElement = document.querySelector("#pano-image > canvas") as HTMLElement; // Blur

    element.style.filter = "blur(5px)";

    let rotationAnim = () => { viewer.panorama.rotation.y -= 0.001; }; // Rotation
    viewer.addUpdateCallback(rotationAnim);

    const welcomeDialogue : NPCReplicaInterface[] = [{ // Start 'button'
        text: "Добро пожаловать в NSU-Tour!",
        options: ["Начать тур!"],
        emojis: [],
        order: [-1]
    }];

    const food_bar = document.getElementById("food-bar"); // Hide food bar

    // Start game, so remove all effects
    typeDialog(welcomeDialogue).then(() => {
     console.log("welcome dialog ended");
     viewer.setPanorama(nextPano.pano_obj);
     viewer.removeUpdateCallback(rotationAnim);
     element.style.filter = "";

     food_bar.style.opacity = "1";
    })

}

export function init() : PANOLENS.Viewer {


    // let textures = {};
    //
    // for(let link of [pano1_url, pano2_url, pano_wellcome_url] ){
    //     // let image = new Image();
    //     // image.src = link;
    //     textures[link] = PANOLENS.TextureLoader.load( link );
    // }


    const panoDiv: HTMLElement|null = document.getElementById("pano-image");

    const viewer: PANOLENS.Viewer = new PANOLENS.Viewer({
        container: panoDiv,
        output: 'console',
        controlButtons: ['setting', 'video'],
        // autoHideInfospot: false,
    });


    // TODO:
    // - расширить интерфейс окна для добавления новых проперти

    window.DEBUG = true;

    if(window.DEBUG)
        window.GUI = new dat.GUI();

    for(let pan of panorams) {
        pan.setViewer(viewer);
        viewer.add( pan.pano_obj );

        window.PANORAMS[pan.name] = pan.pano_obj;
    }
    // for(let pan of panorams) pan.linking();

    // init edges
    // for(const pan of panorams) {
    //     for(const {dest, pos} of pan.transition_edges) {
    //
    //         if(!objects[dest]) {
    //             console.log(`panorama with name: "${dest}" not exist can't link`)
    //             continue;
    //         }
    //
    //         pan.pano_obj.link( window.PANORAMS[dest], pos );
    //     }
    // }

    panorams[0].pano_obj.addEventListener( 'load', () => {
        // Фикс, чтобы панорма загружалась. Тк css грузится после js
        viewer.HANDLER_WINDOW_RESIZE();
        initWelcomeScreen(viewer, panorams[1]);
    });

    return viewer;
}

// TODO: Rewrite this hardcode to reading configs
export const MAIN_NPC = new NPC("steve", steve_url, '../content/first-man.json');
// export const MAIN_NPC = new NPC("steve", "../models/ded/Ch39_nonPBR.fbx");
export const SANDWICH_FOOD = new Food("SANDWICH", sandwich_url, 1, {x: 0.1, y: 0.1, z: 0.1});
export const STATUS_BAR = new StatusBar("food-bar", "", "food-bar", 6);
STATUS_BAR.load();
STATUS_BAR.increase(3);

export const panorams = [
    new PanoramaItem({
        name: "welcome_screen",
        pano_url: pano_wellcome_url,
        transition_edges: [],
        enter_look_direction: new THREE.Vector3(0, 0, 0),
        npc_list: [],
        lightPos: []
    }, false),
    new PanoramaItem({
        name: "1f2b_entry",
        pano_url: pano1f2b_entry_url,
        transition_edges: [{
            dest: "4_elev",
            pos: new THREE.Vector3(-4154.84, -788.19, -2654.85)
        }],
        enter_look_direction: new THREE.Vector3(4464.09, -738.67, 2113.00),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(20, 0, 40)
        },
            {
                npc: SANDWICH_FOOD,
                pos: new THREE.Vector3(-2, -2, -3.5)
            }],
        lightPos: [new THREE.Vector3(30, 0, 0)]
    }),
    new PanoramaItem({
        name: "4_elev",
        pano_url: pano4_elev_url,
        transition_edges: [{
            dest: "1f2b_entry",
            pos: new THREE.Vector3(60.30, -1233.69, -4839.94)
        }, {
            dest: "4_cava_new",
            pos: new THREE.Vector3(3067.86, -595.19, 3890.01)
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }],
        lightPos: []
    }),
    new PanoramaItem({
        name: "4_cava_new",
        pano_url: pano4_cava_new_url,
        transition_edges: [{
            dest: "4_bookshare",
            pos: new THREE.Vector3(4789.58, -626.60, -1250.63)

        }, {
            dest: "4_elev",
            pos: new THREE.Vector3(-4806.11, -368.91, 1299.47)
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }],
        lightPos: []
    }),
    new PanoramaItem({
        name: "4_bookshare",
        pano_url: pano4_bookshare_url,
        transition_edges: [{
            dest: "4_kbrd",
            pos: new THREE.Vector3(4745.97, 13.77, -1567.83)

        }, {
            dest: "4_cava_new",
            pos: new THREE.Vector3(-4821.59, -123.44, 1278.92)
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }],
        lightPos: []
    }),
    new PanoramaItem({
        name: "4_kbrd",
        pano_url: pano4_kbrd_url,
        transition_edges: [{
            dest: "3_near_3107",
            pos: new THREE.Vector3(138.57, -346.01, -4979.14)

        }, {
            dest: "4_bookshare",
            pos: new THREE.Vector3(-4711.32, -887.65, -1390.68)
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }],
        lightPos: []
    }),
    new PanoramaItem({
        name: "3_near_3107",
        pano_url: pano3_near_3107_url,
        transition_edges: [{
            dest: "3_cafeteria",
            pos: new THREE.Vector3(4988.09, -45.51, -193.11)

        }, {
            dest: "4_kbrd",
            pos: new THREE.Vector3(-4821.59, -123.44, 1278.92)
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }],
        lightPos: []
    }),
    new PanoramaItem({
        name: "3_cafeteria",
        pano_url: pano3_cafeteria_url,
        transition_edges: [{
            dest: "3_cafeteria_galery",
            pos: new THREE.Vector3(4771.41, -1447.13, 219.43)

        }, {
            dest: "3_near_3107",
            pos: new THREE.Vector3(676.16, -317.22, -4935.69)
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }],
        lightPos: []
    }),
    new PanoramaItem({
        name: "3_cafeteria_galery",
        pano_url: pano3_cafeteria_galery_url,
        transition_edges: [{
            dest: "hall_4f_1b",
            pos: new THREE.Vector3(4745.97, 13.77, -1567.83)

        }, {
            dest: "3_cafeteria",
            pos: new THREE.Vector3(-363.07, -1106.21, -4854.96)
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }],
        lightPos: []
    }),
];

