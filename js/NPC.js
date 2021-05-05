import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as PANOLENS from "panolens";
import {type} from "./functions";


export class NPC{
    constructor(name, path){
        this.name = `npc_${name}`;
        this.npc_obj = null;
        this.path = path;
        this.loader = null;

        this.replics = [
            "Привет ты находишься в НГУ^100(ЭУ)",
            "иди нахуй",
            "asdasdasdasd",
            "sadasdsad",
        ];
        this.replic_i = 0;
    }

    async load(){
        if(this.npc_obj) return;

        console.log("loading npc model")

        if(this.path.endsWith(".gltf")) await this.load_GLTF();
        else console.log("Can't load npc model");

        return
    }

    async load_GLTF() {
        this.loader = new GLTFLoader();
        await new Promise(
            resolve => this.loader.load(this.path, (gltf) => {
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
    move(vec){
        if(!this.npc_obj) return;
        this.npc_obj.position.set(vec.x,vec.y,vec.z);
    }
    handleClick() {
        console.log(`You clicked on Me!\n (im: ${this.name} !!!)`);

        let replic;
        if(this.replic_i < this.replics.length){
            replic =  this.replics[this.replic_i] ;
            this.replic_i++;
        }else{
            replic =  "Продолжай экскурсию";
        }


        type([replic]);
    }



}

