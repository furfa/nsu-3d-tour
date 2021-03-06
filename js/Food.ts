import { NPC, NPCReplicaInterface } from './NPC'
import { STATUS_BAR } from "./init";
import { AfterAction } from "./TypedTools";

const defaultActions : NPCReplicaInterface[] = [
    {
        text: "Найден предмет",
        options: ["Привет!", "Съесть"],
        emojis: ["128079", "128523"],
        order: [1, 2]
    },
    {
        text: "Привяо!",
        options: [],
        order: []
    },
    {
        text: "Ням!",
        options: [],
        emojis: ["128282"],
        action: AfterAction.Eat,
        order: []
    }
]

export class Food extends NPC {
    eatCost: number;
    replicas_path = "";
    constructor(name : string, path : string, eatCost:number=1, scale:{x:number,y:number,z:number}={x:0.4, y:0.4, z:0.4}) {
        super(name, path);
        this.replicas = defaultActions;
        this.name = `food_${name}`;
        this.usualScale = scale;
        this.eatCost = eatCost;
    }

    // When someone eat object we need to remove it from scene
    becameEaten() {
        STATUS_BAR.increase(this.eatCost);
        this.npc_obj.parent.remove(this.npc_obj);
    }
}