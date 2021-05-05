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
           this.removeAllNPCs();
           console.log(this.npc_list);
        });

        this.pano_obj.addEventListener( 'click', ( event ) => {

            if ( event.intersects.length > 0 ) {
              console.log(event);

              let intersect : THREE.Mesh = event.intersects[ 0 ].object;

              if ( !(intersect instanceof PANOLENS.Infospot) && intersect.material ){
                  let name = this.detectNPCName(intersect);
                  for(let {npc, pos} of this.npc_list){
                      if(npc.name === name) npc.handleClick();
                  }
              }
            }
        } );

    }

    detectNPCName(obj){
      for (let i = 0; i <= 20 && obj.type !== 'Scene'; i++) {
          obj = obj.parent;
      }
      if(obj.type === 'Scene')
          return obj.name;
      return null;
    }

    removeAllNPCs() {
        for(let {npc, pos} of this.npc_list) {
            // this.pano_obj.remove(npc.npc_obj);
            THREE.SceneUtils.detach(npc.npc_obj, this.pano_obj, this.viewer);
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
                    console.log(this);
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