import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { typeDialog, AfterAction } from './TypedTools';
import { addDebugGUI } from './SceneFunctions';

import TWEEN from '@tweenjs/tween.js';

export async function getReplicasByConfig(filename : string) : Promise<NPCReplicaInterface[]> {
    console.log('filename', filename);
    if (!filename.endsWith(".json")) {
        console.warn(`unable to parse ${filename} (need .json)`);
        return null;
    }
    let response = await fetch(filename)
    return await response.json();
}

export interface NPCReplicaInterface {
    text:string,
    options: string[],
    emojis? : string[],
    action?: AfterAction,
    order: number[]
}
const npcReplicasExample = [
    {
        text: "Это стандартный диалог. Если ты его видишь, что-то пошло не так...",
        options: ["Ладно", "Текст"],
        emojis: ["128150", "128548"],
        order: [-1, -1]
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
    replicas_path:string;
    npc_obj: THREE.Object3D|any;
    replica_i: number;
    usualScale: {x: number, y:number, z:number};

    constructor(name : string, path : string) {
        this.name = `npc_${name}`;
        this.npc_obj = null;
        this.path = path;
        this.replicas_path = "";

        this.replica_i = 0;
        this.usualScale = {
            x : 0.8,
            y : 0.8,
            z : 0.8,
        }
    }

    setReplicasPath(path:string){
        this.replicas_path = path;
    }

    async load() : Promise<void> {
        // load replicas

        if (this.replicas_path != "") {
            this.replicas = await getReplicasByConfig(this.replicas_path);
        }

        // load model
        if(this.npc_obj) return;

        console.log("loading npc model")

        if(this.path.endsWith(".gltf")){
            await this.loadGLTF();
            this.addToControlPanel();
        }
        else if(this.path.endsWith(".fbx")) {
            await this.loadFBX();
            this.addToControlPanel();
        }
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
                anim.load('Doging Right.fbx', (anim:any) => {
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

    handleClick() : Promise<AfterAction> {
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

        return typeDialog(this.replicas); // Start dialogue
    }

    addToControlPanel(){
        addDebugGUI(this.npc_obj, this.name);
    }

}

