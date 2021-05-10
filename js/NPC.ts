import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {typeDialog} from './TypedTools';

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
        options: ["..."],
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
    replica_i: number;
    usualScale: {x: number, y:number, z:number};

    constructor(name : string, path : string, replicas: NPCReplicaInterface[] = npcReplicasExample) {
        this.name = `npc_${name}`;
        this.npc_obj = null;
        this.path = path;
        this.replicas = replicas;
        this.replica_i = 0;
        this.usualScale = {
            x : 0.8,
            y : 0.8,
            z : 0.8,
        }
    }

    async load() : Promise<void> {
        if(this.npc_obj) return;

        console.log("loading npc model")

        if(this.path.endsWith(".gltf")) await this.loadGLTF();
        else if(this.path.endsWith(".fbx")) await this.loadFBX();
        else console.log("Can't load npc model");
    }

    async loadGLTF() : Promise<void> {
        const loader = new GLTFLoader();
        await new Promise<void>((resolve) => {
            loader.load(this.path, (gltf) => {
                this.npc_obj = gltf.scene;
                this.npc_obj.scale.set(this.usualScale.x, this.usualScale.y, this.usualScale.z);
                this.npc_obj.name = this.name;

                // Тени хз работают или нет
                this.npc_obj.traverse( function ( object: THREE.Mesh ) {

                    if ( object.isMesh ) object.castShadow = true;

                } );


                console.log(`loaded GLTF ${this.name}`);
                resolve();
            });
        });
    }
    async loadFBX() : Promise<void> {
        const loader = new FBXLoader();
        await new Promise<void>((resolve) => {
            loader.load(this.path, (fbx) => {
                fbx.scale.setScalar(0.1);
                fbx.traverse(c => {
                    c.castShadow = true;
                });

                const anim: FBXLoader = new FBXLoader();
                anim.setPath('../models/ded/');
                anim.load('Doging Right.fbx', (anim) => {
                    let _mixer = new THREE.AnimationMixer(fbx);
                    const idle = _mixer.clipAction(anim.animations[0]);
                    idle.play();
                })

                // Something strange:
                this.npc_obj = fbx;
                // this._scene.add(fbx);
                resolve();
            });
        });
    }
    move(vec: THREE.Vector3) {
        if(!this.npc_obj) return;
        this.npc_obj.position.set(vec.x,vec.y,vec.z);
    }
    handleClick() {
        console.log(`You clicked on me!\n (im: ${this.name})`);

        let scale = {
            x: this.usualScale.x,
            y: this.usualScale.y,
            z: this.usualScale.z
        };
        let tweenTo = new TWEEN.Tween(scale)
            .to({
                x: this.usualScale.x * 1.2,
                y: this.usualScale.y * 1.2,
                z: this.usualScale.z * 1.2
            }, 300)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(()=>{
                this.npc_obj.scale.set(
                scale.x,
                scale.y,
                scale.z
                );
            });
        let tweenBack = new TWEEN.Tween(scale)
            .to({
                x: this.usualScale.x,
                y: this.usualScale.y,
                z: this.usualScale.z
            }, 300)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(()=>{
                this.npc_obj.scale.set(
                scale.x,
                scale.y,
                scale.z
                );
            });
        tweenTo.chain(tweenBack);
        tweenTo.start(); // Start animation chain

        typeDialog(this.replicas); // Start dialogue
    }

    animatedMovement(pos: THREE.Vector3) {

    }

}

