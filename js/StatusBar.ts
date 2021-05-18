
interface  StatusBarInterface {
    name: string;
    path: string;
    selector: string;
    maxAmount: number;
    amount: number;
    onPage: {
        'parent': HTMLElement,
        'ol': HTMLElement,
        'cells': HTMLElement[],
    };
    loaded: boolean;
}

export class StatusBar implements StatusBarInterface {
    name;
    path;
    selector;
    maxAmount;
    amount;
    onPage;
    loaded;

    constructor(name: string, path: string, selector: string, maxAmount: number) {
        this.name = `sb_${name}`;
        this.path = path;
        this.selector = selector;
        this.maxAmount = maxAmount;
        this.amount = 0;
        this.onPage = {};
        this.onPage.cells = [];
        this.loaded = false;
    }

    decrease(amount : number) {
        if (!this.loaded) {
            console.warn( 'Load status bar first, then decrease' );
            return;
        }
        if (this.amount - amount >= 0) {
            this.amount -= amount;
            for (let i = 0; i < amount; ++i) {
                this.removeCell();
            }
        }
    }

    increase(amount : number) {
        if (!this.loaded) {
            console.warn( 'Load status bar first, then increase' );
            return;
        }
        if (this.amount + amount <= this.maxAmount) {
            this.amount += amount;
            for (let i = 0; i < amount; ++i) {
                this.addCell();
            }
        }
    }

    load() {
        console.log(`loading status bar: ${this.name}`);
        this.onPage.parent = document.getElementById(this.selector);
        this.onPage.ol = document.createElement("ol");
        this.onPage.parent.appendChild(this.onPage.ol);
        this.loaded = true;
    }

    addCell() {
        let li = document.createElement("li");
        li.innerHTML = '<img src="../img/hunger.png" ></img>';
        this.onPage.ol.appendChild(li);
        this.onPage.cells.push(li);
    }

    removeCell() {
        let childCount: number = this.onPage.cells.length;
        if (childCount > 0) {
            this.onPage.ol.removeChild(this.onPage.cells[childCount - 1]);
            this.onPage.cells.splice(childCount - 1, 1);
        }
    }

}