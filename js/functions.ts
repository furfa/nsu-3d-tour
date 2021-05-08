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
        showCursor: false,
    });
}

export async function typeDialog(replicas: NPCReplicaInterface[]) {
    clearOptions();
    let replica: NPCReplicaInterface = replicas[0];
    while (true) {
        type([replica.text]);
        renderOptions(replica.options);
        let selectedOp : any = await createOptions(replica.options);
        if (selectedOp == null) {
            selectedOp = 0;
        }
        let order = replica.order[selectedOp];
        if (order == -1) break;
        replica = replicas[order];
    }
}

function clearTyped() : void {
    typed.destroy();
}
