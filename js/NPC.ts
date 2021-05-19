import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { typeDialog, AfterAction } from './TypedTools';
import { addDebugGUI } from './SceneFunctions';

import TWEEN from '@tweenjs/tween.js';


export interface NPCReplicaInterface {
    text:string,
    options: string[],
    emojis? : string[],
    action?: AfterAction,
    order: number[]
}
const npcReplicasExample = [
    {
        text: "привет! меня зовут ****! сегодня я тебе расскажу о лучшем факультете Новосибирского государственного университета-механико-математическом! Сейчас мы находимся на 4 этаже. пойдем, я тебе расскажу как тут всё устроено. ",
        options: ["Люблю матфак и всё что с ним связано", "Матфак НЕ лучший факультет"],
        emojis: ["128150", "128548"],
        order: [1, 3]
    },
    {
        text: "Да, я тоже. Поэтому мы здесь.\n" +
            "Сзади тебя находится яблоко, съешь его!",
        options: ["Зачем?", "Хорошая идея"],
        emojis: ["128563", "128077"],
        order: [2, -1]
    },
    {
        text: "Ты задаешь слишком много вопросов",
        options: ["Диалог был написан в 12 часов ночи. спасибо за внимание"],
        emojis: ["9851"],
        order: [-1]
    },
    {
        text: "-20 social credits",
        options: ["Звуки ярости", "Звуки справедливости"],
        emojis: ["129324", "128519"],
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
    npc_obj: THREE.Object3D|any;
    replica_i: number;
    usualScale: {x: number, y:number, z:number};
    actionFunc: Function;

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
        this.actionFunc = null;
    }

    async load() : Promise<void> {
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

