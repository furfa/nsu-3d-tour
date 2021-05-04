import * as PANOLENS from "panolens";
import * as THREE from "three";

import {addALight} from "./SceneFunctions";

export let current_location = "";
export class PanoramaItem{
    constructor({name,
                 pano_url,
                 transition_edges=[],
                 enter_look_direction = new THREE.Vector3(0,0,0),
                 npc_list
                } = {}){
        this.viewer;

        this.name = name;
        this.pano_url = pano_url;
        this.transition_edges = transition_edges;
        this.pano_obj = new PANOLENS.ImagePanorama(this.pano_url);
        this.enter_look_direction = enter_look_direction;

        this.first_look = true;
        this.npc_list = npc_list;

        addALight(this.pano_obj);

        this.pano_obj.addEventListener('enter', () => {
            current_location = this.name;
            console.log(`entering "${current_location}"`);
            this.loadNPCs();
            if(this.first_look){

                this.viewer.tweenControlCenter(this.enter_look_direction, 0);
                console.log(`Looking at ${this.enter_look_direction}`)
                this.first_look = false;
            }

            this.moveNPCs();

            console.log(this);
        });

        this.pano_obj.addEventListener('leave', () => {
           console.log(`leave ${this.name}`);
           // this.removeAllNPCs();
        });

        this.pano_obj.addEventListener( 'click', ( event ) => {

            if ( event.intersects.length > 0 ) {
              console.log(event);

              let intersect = event.intersects[ 0 ].object;

              if ( !(intersect instanceof PANOLENS.Infospot) && intersect.material ){
                console.log("You clicked on npc !!!");
              }
            }
        } );

    }

    removeAllNPCs() {
        for(let {npc, pos} of this.npc_list) {
            this.pano_obj.remove(npc.npc_obj);
        }
    }

    setViewer(viewer){
        this.viewer = viewer;
    }

    loadNPCs(){
        for(let {npc, pos} of this.npc_list){
            npc.load().then(
                () => {
                    console.log(`adding npc ${npc.name} to panorama ${this.name}`);
                    this.pano_obj.add(npc.npc_obj);
                }
            );
        }
    }

    moveNPCs(){
        for(let {npc, pos} of this.npc_list){
            npc.move(pos);
        }
    }
}