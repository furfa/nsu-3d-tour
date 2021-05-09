import * as PANOLENS from "panolens";
import * as THREE from "three";
import {NPC} from "./NPC";
import {addALight, addAPointLight, addFloor} from "./SceneFunctions";
import { hideActionBox } from "./TypedTools"


interface PanoramaItemInterface {
    name: string;
    pano_url: string;
    transition_edges: { dest: string, pos: THREE.Vector3 }[];
    enter_look_direction: THREE.Vector3;
    npc_list: {npc: NPC, pos: THREE.Vector3}[];
    lightPos: THREE.Vector3[];
}

export let current_location: string = "";
export class PanoramaItem implements PanoramaItemInterface {
    name;
    pano_url;
    transition_edges;
    enter_look_direction;
    npc_list;
    lightPos;
    pano_obj: PANOLENS.Panorama;
    first_look: boolean;
    viewer:PANOLENS.Viewer;

    constructor({
          name,
          pano_url,
          transition_edges = [],
          enter_look_direction = new THREE.Vector3(0,0,0),
          npc_list,
          lightPos = []
        } : PanoramaItemInterface) {

        this.name = name;
        this.pano_url = pano_url;
        this.transition_edges = transition_edges;
        this.pano_obj = new PANOLENS.ImagePanorama(this.pano_url);
        this.enter_look_direction = enter_look_direction;

        this.first_look = true;
        this.npc_list = npc_list;
        this.lightPos = lightPos;

        this.initScene();
    }

    detectNPCName(obj: THREE.Mesh|any) : string {
      for (let i = 0; i <= 20 && obj.type !== 'Scene'; i++) {
          obj = obj.parent;
      }
      if(obj.type === 'Scene') {
          return obj.name;
      }
      return null;
    }

    setViewer(viewer: PANOLENS.Panorama) {
        this.viewer = viewer;
    }

    async loadNPCs() {
        // TODO:
        // - make for async
        for (let {npc, pos} of this.npc_list) {
            await npc.load();
            console.log(`adding npc ${npc.name} to panorama ${this.name}`);
            this.pano_obj.add(npc.npc_obj);
            console.log('panorama:', this);
        }
    }

    moveNPCs() {
        for(let {npc, pos} of this.npc_list) {
            npc.move(pos);
        }
    }

    initScene() {


        // Enter event
        this.pano_obj.addEventListener('enter', () => {

            current_location = this.name;
            console.log(`entering "${current_location}"`);
            this.loadNPCs().then(() => this.moveNPCs());
            if(this.first_look) {
                this.viewer.tweenControlCenter(this.enter_look_direction, 0);
                console.log(`Looking at ${this.enter_look_direction}`);

                // adding objects

                addALight(this.pano_obj);
                for (let position of this.lightPos) {
                    addAPointLight(this.pano_obj, position);
                }

                addFloor(this.pano_obj);
                this.first_look = false;
            }


            console.log(this);
        });

        // Leave event
        this.pano_obj.addEventListener('leave', () => {
           console.log(`leave ${this.name}`);
           console.log(`NPCs left: ${this.npc_list} (should be empty)`);
        });

        // Click event
        this.pano_obj.addEventListener( 'click', ( event ) => {
            if ( event.intersects.length > 0 ) {
              console.log(event);

              let intersect : THREE.Mesh = event.intersects[ 0 ].object;

              if ( !(intersect instanceof PANOLENS.Infospot) && intersect.material ) {
                  let name: string = this.detectNPCName(intersect);

                  for(let {npc, pos} of this.npc_list) {
                      if(npc.name === name) {
                          npc.handleClick();
                      }
                  }
              }
            }else{
                hideActionBox();
                console.log("click not to NPC");
            }
        });

    }
}