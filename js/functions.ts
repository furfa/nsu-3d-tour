import Typed from "typed.js";
import {NPC, NPCReplicaInterface} from './NPC';

// Globals for configuring typing
let typed: Typed;
let typeSpeed: number = 0;

export function type(strings: string[]) : void {
    console.log(strings);

    typed && clearTyped();

    typed = new Typed('#typed', {
        strings: ["",...strings],
        typeSpeed: typeSpeed,
    });
}

export  function typeDialog(replicas: NPCReplicaInterface[]) {
    type([replicas[0].text]);
    // TODO:
    // Interactive dialogues
}

function clearTyped() : void {
    typed.destroy();
}
