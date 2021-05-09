import {NPC, NPCReplicaInterface} from './NPC'

const defaultActions : NPCReplicaInterface[] = [
    {
        text: "Найден предмет",
        options: ["Подобрать", "Съесть"],
        order: [1, 2]
    },
    {
        text: "Быстро поднятое упавшим не считается",
        options: ["..."],
        order: [-1]
    },
    {
        text: "Ням!",
        options: ["..."],
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
    }
}