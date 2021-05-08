import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as PANOLENS from 'panolens';
import {type, typeDialog} from './functions';

import TWEEN from '@tweenjs/tween.js';

export interface NPCReplicaInterface {
    text:string,
    options: string[],
    order: number[]
}
const npcReplicasExample = [
    {
        text: "hola, amigo!",
        options: ["hola, hombre!", "no eres mi amigo, liendres cúbico"],
        order: [1, 4]
    },
    {
        text: "Bienvenido a NSU,\n" +
            "¿qué planeas hacer?",
        options: ["tengo mucha hambre.", "estoy aprendiendo aquí"],
        order: [2, 3]
    },
    {
        text: "maravilloso!",
        options: ["sí, tengo que irme"],
        order: [5]
    },
    {
        text: "desconocer...",
        options: ["nos conoceremos, adiós."],
        order: [5]
    },
    {
        text: "¿por qué es tan grosero?..",
        options: [],
        order: [5]
    },
    {
        text: "nos vemos",
        options: [],
        order: [-1]
    }
]

interface  NPCInterface {
    name: string;
    path: string;
    replicas: NPCReplicaInterface[];
}

export class NPC implements NPCInterface {
    name;
    path;
    replicas;
    npc_obj: THREE.Scene;
    loader: GLTFLoader;
    replica_i: number;

    constructor(name : string, path : string, replicas: NPCReplicaInterface[] = npcReplicasExample) {
        this.name = `npc_${name}`;
        this.npc_obj = null;
        this.path = path;
        this.loader = null;
        this.replicas = replicas;
        this.replica_i = 0;
    }

    async load() : Promise<void> {
        if(this.npc_obj) return;

        console.log("loading npc model")

        if(this.path.endsWith(".gltf")) await this.load_GLTF();
        else console.log("Can't load npc model");
    }

    async load_GLTF() : Promise<void> {
        this.loader = new GLTFLoader();
        await new Promise<void>(
            (resolve) => this.loader.load(this.path, (gltf) => {
                    this.npc_obj = gltf.scene;
                    this.npc_obj.scale.set(1, 1, 1);
                    this.npc_obj.position.set(20, 0, 40);
                    this.npc_obj.name = this.name;
                    console.log(`loaded GLTF ${this.name}`);
                    resolve();
                }
            ),
        );
    }
    move(vec: THREE.Vector3) {
        if(!this.npc_obj) return;
        this.npc_obj.position.set(vec.x,vec.y,vec.z);
    }
    handleClick() {
        console.log(`You clicked on me!\n (im: ${this.name})`);


        // Setup the animation loop.
    // function animate(time) {
    //     requestAnimationFrame(animate);
    //     TWEEN.update(time);
    // }
    // requestAnimationFrame(animate);

    //    ALEXANDER WRITE THIS CODE:
    // var coords = { x: 1, y: 1, z:1 }; // Start at (0, 0)
    // var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
    //   .to({ x: 2, y: 2, z: 2 }, 1000) // Move to (300, 200) in 1 second.
    //   .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    //     .onUpdate(function() { // Called after tween.js updates 'coords'.
    //         this.npc_obj.scale.set(
    //             coords.x,
    //             coords.y,
    //             coords.z
    //             );
    //     })
    //     .start(); // Start the tween immediately.

        typeDialog(this.replicas); // Start dialogue
    }


}

