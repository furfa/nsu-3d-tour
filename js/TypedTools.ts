import Typed from "typed.js"
import TWEEN from '@tweenjs/tween.js';
import { NPCReplicaInterface } from './NPC'

export enum AfterAction {
    Leave, // Leaves panorama after reenter
    Eat, // Leaves panorama immediately
    None, // Just nothing
    UnlockLeaving, // Make leaving available
}

// Globals for configuring typing
let typeSpeed: number = 1;
let typedMain: Typed;
let typedOptions: Typed[] = [];

// Type message
function balancer(string: string) : string[] {

    let dialogueBox = document.querySelector("#typed-block") as HTMLElement;
    let coordParameters = dialogueBox.getBoundingClientRect()
    /*
    DOMRect {
        bottom: 177,
        height: 54.7,
        left: 278.5,​
        right: 909.5,
        top: 122.3,
        width: 631,
        x: 278.5,
        y: 122.3,
    }
     */
    console.log(coordParameters);

    let height : number = coordParameters.height;
    height = 150;
    let width :number = coordParameters.width;
    width = 750;
    let letSize : number = parseInt(window.getComputedStyle(dialogueBox, null).getPropertyValue('font-size'));
    let letOnPage = width * height / (letSize * letSize * 4);
    console.log(`height: ${height},\nwidth: ${width}\nletSize: ${letSize}\nletOnPage: ${letOnPage}`);
    let words = string.split(' ');

    let strings : string[] = [];
    let letter = '';
    let currentLen = 0;
    for (let word of words) {
        if (word.length + currentLen < letOnPage) {
            letter += ' ' + word;
            currentLen += word.length;
        }
        else {
            strings.push(letter);
            letter = '';
            currentLen = 0;
        }
    }
    if (letter != '') {
        strings.push(letter);
    }

    console.log('strings: ', strings);
    return strings;
}

async function typeMain(string: string, options_func ) : Promise<void> {
    console.log(string);
    let dialogueBox = document.querySelector("#dialog") as HTMLElement;

    typedMain && clearDialogue();
    showActionBox();
    let messages = balancer(string);

    let promises = [];

    const getProm = (index) => {
        if(index >= messages.length) return;

        let message = messages[index];

        if(index != messages.length - 1){
            message +="<br/>➡КЛИК➡";
        }else{
            return new Promise<void>((resolve)=>{
                typedMain = new Typed('#typed', {
                    strings: ["", message],
                    typeSpeed: typeSpeed,
                    showCursor: false,
                    onComplete(self: Typed) {
                        resolve();
                    }
                });

            });
        }


        return new Promise<void> ((resolve) => {
            typedMain = new Typed('#typed', {
                strings: ["", message],
                typeSpeed: typeSpeed,
                showCursor: false,
            });
            const clickHandler = () => {
                resolve();
                dialogueBox.removeEventListener("click", clickHandler, false);
            }

            dialogueBox.addEventListener("click", clickHandler, false);
        }).then(() => getProm(index+1));
    }

    await getProm(0);

    await options_func();


    // typedMain = new Typed('#typed', {
    //     // strings: [balancer(string)],
    //     strings: [string],
    //     typeSpeed: typeSpeed,
    //     showCursor: false,
    // });
}

// Type response options
function typeOption(options: string[], selector: string) : void {
    console.log('options: ', options);
    let typedOption;

    typedOption = new Typed(`#${selector}`, {
        strings: [...options],
        typeSpeed: typeSpeed,
        showCursor: false,
    });
    typedOptions.push(typedOption);
}

let actionsDiv;
let dialogueDiv;
let optionsOl;

async function sleep(ms) : Promise<void> {
    return new Promise<void>((resolve) => setTimeout(() => {resolve()}, ms) );
}

export async function createOptions(options: string[], emojis: string[]) : Promise<number> {
    if (emojis == null) {
        emojis = [];
    }
    if(!options.length) return null;

    actionsDiv = document.getElementById("actions");
    optionsOl = document.createElement("ol");
    actionsDiv.appendChild(optionsOl);

    let promises : Promise<number>[] = [];

    for (let i = 0; i < options.length; i++) {
        await sleep(700);

        const o = options[i];
        let li = document.createElement("li");
        li.setAttribute("id", `option-${i}`);
        optionsOl.appendChild(li);

        let prom = new Promise<number>((resolve) => {
            li.addEventListener("click", () => {
                console.log(`you clicked on ${o}`);
                clearOptions();
                resolve(i);
            });
        });
        promises.push(prom);

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

export async function typeDialog(replicas: NPCReplicaInterface[]) : Promise<AfterAction> {
    return new Promise<AfterAction> ( async (resolve) => {
        clearOptions();
        let replica: NPCReplicaInterface = replicas[0];
        let action = AfterAction.UnlockLeaving;
        while (true) {
            let selectedOp: any;
            await typeMain(replica.text, async ()=>{
                renderOptions(replica.options);
                selectedOp = await createOptions(replica.options, replica.emojis);
            });
            if (selectedOp == null) {
                await sleep(2000);
                break;
            }
            let order = replica.order[selectedOp];
            if (order == -1) break;
            replica = replicas[order];
            if (replica.action != null) {
                action = replica.action;
            }

        }
        await clearDialogue();
        await hideDialogueBox();
        resolve(action);
    })
}

function clearDialogue() : void {
    typedMain.destroy();
}

export function hideDialogueBox() : void {
    dialogueDiv || (dialogueDiv = document.getElementById("dialog"));

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
