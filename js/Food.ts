import {NPC, NPCReplicaInterface} from './NPC'
import {STATUS_BAR, } from "./init";

const defaultActions : NPCReplicaInterface[] = [
    {
        text: "Найден предмет",
        options: ["Привет!", "Съесть"],
        emojis: ["128079", "128523"],
        order: [1, 2]
    },
    {
        text: "Привяо!",
        options: [""],
        order: [-1]
    },
    {
        text: "Ням!",
        options: [""],
        emojis: ["128282"],
        action: 1,
        order: [-1]
    }
]

export class Food extends NPC {
    constructor(name : string, path : string) {
        super(name, path, defaultActions);
        this.name = `food_${name}`;
        this.usualScale = {
            x : 0.4,
            y : 0.4,
            z : 0.4,
        }
        this.actionFunc = (function (toAdd: number) {
            STATUS_BAR.increase(toAdd);
            this.becameEaten();
        }).bind(this)
    }

    // When someone eat object we need to remove it from scene
    becameEaten() {
        this.npc_obj.parent.remove(this.npc_obj);
    }
}