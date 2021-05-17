import {typeDialog, typeMain} from "./TypedTools";
import {NPC, NPCReplicaInterface} from "./NPC";
import {Food} from "./Food";
import {PanoramaItem} from "./PanoramaItem";
import * as THREE from "three";
import * as PANOLENS from "panolens";
import * as dat from 'dat.gui';

import TWEEN from '@tweenjs/tween.js';

// There is one more (and better) way how to do this
// But it's for nerds
// @ts-ignore
import pano1_url from '../img/pano1.jpg';
// @ts-ignore
import pano2_url from '../img/pano2.jpg';
// @ts-ignore
import pano_wellcome_url from '../img/pano_wellcome.jpg';

import {StatusBar} from "./StatusBar";

declare global{
    interface Window{
        DEBUG:boolean;
        GUI: dat.GUI;
    }
}

function loadWelcomeScreen(viewer, nextPano) {
    console.log('loading welcome screen');
    //TODO:
    // - blur
    // - rotation animation
    const welcomeDialogue : NPCReplicaInterface[] = [{
        text: "Добро пожаловать в NSU-Tour!",
        options: ["Начать тур!"],
        emojis: [],
        order: [-1]
    }];

    typeDialog(welcomeDialogue).then(() => {
     console.log("welcome dialog ended");
     viewer.setPanorama(nextPano.pano_obj);
    })

}

export function init() : PANOLENS.Viewer {
    const panoDiv: HTMLElement|null = document.getElementById("pano-image");

    const viewer: PANOLENS.Viewer = new PANOLENS.Viewer({
        container: panoDiv,
        output: 'console',
    });
    // TODO:
    // - расширить интерфейс окна для добавления новых проперти

    window.DEBUG = true;

    if(window.DEBUG)
        window.GUI = new dat.GUI();

    let objects: {[key: string] : PANOLENS.Panorama;} = {};

    for(let pan of panorams) {
        pan.setViewer(viewer);
        viewer.add( pan.pano_obj );
        objects[pan.name] = pan.pano_obj;
    }
    // init edges
    for(const pan of panorams) {
        for(const {dest, pos} of pan.transition_edges) {

            if(!objects[dest]) {
                console.log(`panorama with name: "${dest}" not exist can't link`)
                continue;
            }

            pan.pano_obj.link( objects[dest], pos );
        }
    }

    // const welcomeMessage: string = "поговори со Стивом чтобы начать тур";

    panorams[0].pano_obj.addEventListener( 'load', () => {
        // typeMain([welcomeMessage]);
        loadWelcomeScreen(viewer, panorams[1]);
    });

    return viewer;
}

// TODO: Rewrite this hardcode to reading configs

export const MAIN_NPC = new NPC("steve", "../models/steve/scene.gltf");
// export const MAIN_NPC = new NPC("steve", "../models/ded/Ch39_nonPBR.fbx");
export const APPLE_FOOD = new Food("apple", "../models/apple/scene.gltf");
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
            dest:"after_cava_4f_1b",
            pos: new THREE.Vector3( 3047.29, -767.20, 3880.51 )
        }],
        enter_look_direction: new THREE.Vector3(4464.09, -738.67, 2113.00),
        npc_list: [{
            npc: MAIN_NPC,
            pos: new THREE.Vector3(20, 0, 40)
        },
        {
            npc: APPLE_FOOD,
            pos: new THREE.Vector3(-2, -2, -3.5)
        }],
        lightPos: [new THREE.Vector3(30, 0, 0)]
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
        }],
        lightPos: []
    }),
];