export interface IOptions {
    hard:boolean,
    extraHard:boolean,
    showTimer:boolean,
    highContrast:boolean,
    wordLength:number,
    invertedKeys:boolean
}
type FN = (...args:any[])=>any;
const propertyDescriptions = {
    hard: "Revealed hints must be used in subsequent attempts",
    extraHard:"Yellow letters must move away from where they were clued, and gray clues must be obeyed",
    highContrast:"High contrast colors",
    showTimer:"Turn on to show the timer in the game",
    invertedKeys:"Swap backspace and enter"
}
export class Options implements IOptions{
    public hard = false;
    public showTimer = false;
    public extraHard = true;
    public wordLength = 5;
    public highContrast = false;
    public invertedKeys = false;
    private listeners:Record<string, FN> = {}
    constructor(rootEl:HTMLDivElement) {
        this.renderElement(rootEl)
    }
    renderElement(root:HTMLDivElement) {
        const optionsCont = document.createElement("div");
        const toggleBtn = document.createElement<"button">("button");
        toggleBtn.addEventListener("click", () => {
            const board = root.lastElementChild as HTMLDivElement;
            if(optionsCont.style.display === "flex") {
                optionsCont.style.display = "none";
                board.style.display = "block";
            }else {
                optionsCont.style.display = "flex";
                board.style.display = "none"
            }
        })
        optionsCont.className = "options";
        optionsCont.appendChild(this.renderButtons())
        for(let key in this) {
            if(typeof this[key] !== "boolean") continue;
            optionsCont.appendChild(this.renderOption(key))

        }
        root.append(toggleBtn, optionsCont);

    }

    renderOption(key:string) {
        const option = document.createElement("div");
        option.className = "option";
        const descContainer = document.createElement("div");
        descContainer.className ="headers"
        const header = document.createElement("h3");
        let arr =  key.split(/(?=[A-Z])/);
        arr = arr.map((word, index)=>{
            let final = word;
            if(index === 0) {
                final = word.charAt(0).toUpperCase() + word.slice(1)
            }
            if(index!==arr.length-1){
                final += " "
            }
            return final

        })
        header.textContent = arr.join("")
        const parag = document.createElement("p");
        parag.className = "description";
        parag.textContent = propertyDescriptions[key];
        descContainer.append(header, parag);
        option.append(descContainer, this.renderCheckbox(key))
        return option
    }
    renderCheckbox(key:string) {
        const div = document.createElement("div");
        div.className = "checkbox";
        const label = document.createElement("label");
        label.className = "label_check";
        const input = this.renderInput(key, "checkbox");
        input.addEventListener("click", ()=>{
            this[key] = !this[key];
            input.checked = this[key];
            console.log(key);
            if(key in this.listeners) {
                const cb = this.listeners[key]();
                if(cb instanceof Promise) {
                    cb.then()
                }
            }
            if(key === "hard" || key==="extraHard") {
                const selector = key === "hard" ? "extraHard" :  "hard";
                this[selector] = false;
                if(selector) {
                    const otherInput = document.getElementById(selector) as HTMLInputElement;
                    otherInput.checked = false;
                }
            }
        })
        const span = document.createElement("span");
        span.className = "checkbox_text";
        label.append(input, span);
        div.appendChild(label)
        return div;

    }
    renderInput(key, type:string) {
        const input = document.createElement("input");
        input.type = type;
        input.autocomplete = "off";
        input.checked = this[key];
        if(key === "hard" || key ==="extraHard") {
            input.id = key;
        }
        return input;
    }
    renderButtons() {
        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "row btns";

        for(let i = 4; i <= 11; i++) {
            const el = document.createElement("button");
            el.addEventListener("click", () => {
                console.log(i)
                this.length = i;
            });
            el.textContent = i.toString();
            if(this.length === i) {
                el.classList.add("active")
            }
            buttonsDiv.appendChild(el)

        }
        return buttonsDiv
    }
    updateButtons() {
        const btnDiv = document.querySelector(".btns");
        if(!btnDiv) return;
        for(const btn of btnDiv.children) {
            if(this.length === +(btn.textContent as string)) {
                btn.classList.add("active")
            }else {
                btn.classList.remove("active")
            }
        }
    }
    set length(newLength:number) {
        this.wordLength = newLength;
        this.updateButtons();
        this.listeners["length"]()
    }
    get length() {
        return this.wordLength
    }
    subscribe(key:keyof typeof propertyDescriptions|"length", cb:FN) {
        this.listeners[key] = cb;
    }

}