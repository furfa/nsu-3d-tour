import { typeDialog } from "./TypedTools";
import { NPC, NPCReplicaInterface } from "./NPC";
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
    }
}

window.PANORAMS = {};

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

export const MAIN_NPC = new NPC("steve", steve_url);
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
        name: "hall_4f_1b",
        pano_url: pano1_url,
        transition_edges: [{
            dest: "after_cava_4f_1b",
            pos: new THREE.Vector3(3047.29, -767.20, 3880.51)
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
        name: "after_cava_4f_1b",
        pano_url: pano2_url,
        transition_edges: [{
            dest: "hall_4f_1b",
            pos: new THREE.Vector3(-5000.00, -414.86, 131.79)
        }, {
            dest: "prev_dickanat_4f_1b",
            pos: new THREE.Vector3(4975.25, -380.38, -187.13)
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }],
        lightPos: []
    }),
    new PanoramaItem({
        name: "prev_dickanat_4f_1b",
        pano_url: pano_prev_dickanat_url,
        transition_edges: [{
            dest: "hall_4f_1b",
            pos: new THREE.Vector3(-5000.00, -414.86, 131.79)

        }, {
            dest: "hall_4f_1b",
            pos: new THREE.Vector3(4975.25, -380.38, -187.13)
        }],
        enter_look_direction: new THREE.Vector3(-4808.73, -492.69, -1240.28),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(100, 0, 40)
        }],
        lightPos: []
    }),
];

