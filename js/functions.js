import Typed from "typed.js";


let typed;

export function type(strings){
    console.log(strings);

    typed && clearTyped();

    typed = new Typed('#typed', {
        strings: ["",...strings],
        typeSpeed: 0,
    });

}

function clearTyped() {
    typed.destroy();
}
