import Typed from "typed.js"
import TWEEN from '@tweenjs/tween.js';
import { NPCReplicaInterface } from './NPC'

// Globals for configuring typing
let typeSpeed: number = 0;
let typedMain: Typed;
let typedOptions: Typed[] = [];

// export function type

export function typeMain(strings: string[]) : void {
    console.log(strings);

    typedMain && clearDialogue();
    showActionBox();
    typedMain = new Typed('#typed', {
        strings: ["",...strings],
        typeSpeed: typeSpeed,
        showCursor: false,
    });
}

function typeOption(options: string[], selector: string) : void {
    console.log('options: ', options);
    let typedOption;

    typedOption = new Typed(`#${selector}`, {
        strings: ["",...options],
        typeSpeed: typeSpeed,
        showCursor: false,
    });
    typedOptions.push(typedOption);
}


let actionsDiv;
let dialogueDiv;
let optionsOl;

async function sleep(ms){
    return new Promise<void>((resolve, reject) => setTimeout(() => {resolve()}, ms) );
}

export async function createOptions(options: string[], emojis: (string | null)[]) : Promise<string> {
    if(!options.length) return null;

    actionsDiv = document.getElementById("actions");
    optionsOl = document.createElement("ol");
    actionsDiv.appendChild(optionsOl);

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
        // Add emojis
        let emoji = "128073"; // <- Default
        if (i < emojis.length && emojis[i] != null) {
            emoji = emojis[i];
        }
        typeOption([`&#${emoji}; : ${o}`], `option-${i}`);
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
        typeMain([replica.text]);
        renderOptions(replica.options);
        let selectedOp : any = await createOptions(replica.options, replica.emojis);
        if (selectedOp == null) {
            selectedOp = 0;
        }
        let order = replica.order[selectedOp];
        if (order == -1) break;
        replica = replicas[order];
    }
    clearDialogue();
    hideActionBox();
}

function clearDialogue() : void {
    typedMain.destroy();
}

export function hideActionBox() : void {
    dialogueDiv || (dialogueDiv = document.getElementById("dialog"));
    // dialogueDiv.classList.add("hidden");

    let cssProp = {
        opacity:dialogueDiv.style.opacity,
    };

    let tweenTo = new TWEEN.Tween(cssProp)
        .to({
            opacity:0.0,
        }, 300)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(()=>{
            dialogueDiv.style.opacity = cssProp.opacity;
        });
    tweenTo.start(); // Start animation
}

function showActionBox() : void {
    dialogueDiv || (dialogueDiv = document.getElementById("dialog"));
    // dialogueDiv.classList.remove("hidden");
    let cssProp = {
        opacity:0.0,
    };

    let tweenTo = new TWEEN.Tween(cssProp)
        .to({
            opacity:1.0,
        }, 300)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(()=>{
            dialogueDiv.style.opacity = cssProp.opacity;
        });
    tweenTo.start(); // Start animation
}
