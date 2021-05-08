import Typed from "typed.js";
import {NPC, NPCReplicaInterface} from './NPC';

// Globals for configuring typing
let typed: Typed;
let typeSpeed: number = 0;

let typedOptions: Typed[] = [];

export function type(strings: string[]) : void {
    console.log(strings);

    typed && clearTyped();

    typed = new Typed('#typed', {
        strings: ["",...strings],
        typeSpeed: typeSpeed,
        showCursor: false,
    });
}

function typeOption(options: string[], selector: string) : void {
    console.log('options: ', options);
    let typedOption;

    typedOption = new Typed('#'+selector, {
        strings: ["",...options],
        typeSpeed: typeSpeed,
        showCursor: false,
    });
    typedOptions.push(typedOption);
}


let actionsDiv;
let optionsOl;

async function sleep(ms){
    return new Promise<void>((resolve, reject) => setTimeout(() => {resolve()}, ms) );
}

export async function createOptions(options:string[]) : Promise<string> {
    if(!options.length) return null;

    actionsDiv = document.getElementById("actions");
    optionsOl = document.createElement("ol");
    actionsDiv.appendChild(optionsOl);

    let selected = null;

    let promises = [];

    for (let i = 0; i < options.length; i++) {
        await sleep(1000);
        const o = options[i];
        let li = document.createElement("li");
        li.setAttribute("id", `option-${i}`);
        // li.innerText = o;
        let prom = new Promise((resolve, reject) => {
            li.addEventListener("click", ()=>{
                console.log(`you clicked on ${o}`);
                clearOptions();
                resolve(i);
            });
        });
        promises.push(prom);
        optionsOl.appendChild(li);
        typeOption([o], `option-${i}`);
    }

    return await Promise.race(promises);
}
export function clearOptions() {
    if (optionsOl) {
        optionsOl.remove();
    }
    for (let option of typedOptions) {
        option.destroy();
    }
}

function renderOptions(options: string[]) {
    let maxLen = options.reduce((accumulator: number, currentValue: string) => {
        return Math.max(accumulator, currentValue.length)
    }, 0);

    console.log(maxLen);

    for (let i = 0; i < options.length; ++i) {
        for (let j = 0; j <  (maxLen - options[i].length); ++j) {
            options[i] += ' ';
        }
    }
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
