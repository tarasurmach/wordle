
import {Guess, IGuess} from "./Guess.js";
import {autoBind} from "../utils/decorator.ts";


const keyboardKeys:string[][] = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"]
];
export class View {
    private rootEl:HTMLDivElement;
    constructor(rootEl:HTMLDivElement) {
        this.rootEl = rootEl;
    }
    @autoBind
    renderLine(line:string[]) {
        const div = document.createElement("div");
        div.className = "line";
        return line.reduce((accum, curr)=>{
            const keyEl = this.renderKey(curr);
            accum.appendChild(keyEl)
            return accum
        }, div)

    }
    renderContainer(keydownListener,clickListener, attempts, wordLength) {
        let str = document.createElement("div");
        str.className = "cont";
        const timeCount = document.createElement("p");
        timeCount.className = "timer";
        timeCount.textContent = "_"
        str.append(this.initializeBoard(keydownListener, attempts, wordLength), timeCount, this.renderKeyboard(clickListener));
        if((this.rootEl.querySelector(".options") as HTMLDivElement).style.display=== "flex") {
            str.style.display = "none"
        }
        if(this.rootEl.lastElementChild?.matches(".cont")) {
            this.rootEl.lastElementChild?.replaceWith(str)
        }else {
            this.rootEl.appendChild(str)
        }
        //this.rootEl.lastElementChild?.replaceWith(str)
    }
    renderKey(key:string) {
        const keyEl = document.createElement("div");
        keyEl.className = "key";
        keyEl.dataset.key = key;
        switch (key) {
            case "Backspace": {
                keyEl.textContent = "DEL";
                break;
            }
            case "Enter": {
                keyEl.textContent = key.toUpperCase();
                break;
            }
            default: keyEl.textContent = key;
        }
        return keyEl
    }
    initializeBoard(eventListener, attempts, wordLength) {
        const board = document.createElement("div");
        board.classList.add("board");
        board.tabIndex = 0;
        board.onkeydown = eventListener;

        this.renderRows(attempts, wordLength, board);
        return board

    }
    resetBoard() {
        const board = this.rootEl.querySelector<HTMLDivElement>(".board");
        if(!board) return;
        for (let i = 0; i < board.children.length; i++) {
            const row = board.children[i].children;
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                cell.className= "cell";
                cell.textContent = ""
            }
        }
    }
    renderKeyboard(cb:Function) {
        console.log("rendering keyb")
        const keyboard = document.createElement("div");
        keyboard.className = "keyboard";
        const lines = keyboardKeys.map(this.renderLine);
        keyboard.append(...lines)
        //this.rootEl.appendChild(keyboard);
        keyboard.addEventListener("click",  async (e:Event)=>{
            if(e.target instanceof HTMLDivElement && e.target.classList.contains("key")) {
                const {dataset:{key}} = e.target;
                if(!key) return;
                await cb(key)
            }
        })
        return keyboard
    }
    resetKeyboard():HTMLDivElement {
        console.log(this)
        const keyboard = this.rootEl.querySelector<HTMLDivElement>(".keyboard") as HTMLDivElement;
        const lines = keyboard.children;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].children;
            for (let j = 0; j < line.length; j++) {
                const lineElement = line[j] as HTMLDivElement;
                lineElement.className = "key"
            }
            
        }
        return keyboard;
    }

    @autoBind
    resetView() {
        this.resetBoard()
        this.resetKeyboard();
    }
    renderRows(attempts:number, wordLength:number, board:HTMLDivElement) {
        for(let i = 0; i < attempts; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            row.dataset.row = i.toString();
            this.renderCells(wordLength, i, row)
            board.appendChild(row)
        }
    }
    renderCells(wordLength:number, row:number, divEl:HTMLDivElement) {
        for (let i = 0; i < wordLength; i++) {
            const cellEl = document.createElement("div");
            cellEl.classList.add("cell");
            cellEl.dataset.pos = i.toString();
            divEl.appendChild(cellEl)
        }
    }
    changeTextContent(key, guess:Guess) {
        const cell = this.queryCell(guess);
        if(!(cell instanceof HTMLDivElement)) return;
        cell.textContent = key.toUpperCase();
    }
    queryCell({row, pos}:Guess):HTMLDivElement {
        const rowEl = document.querySelector(`[data-row="${row}"]`) as HTMLDivElement;
        return rowEl.querySelector(`[data-pos="${pos}"]`) as HTMLDivElement;

    }
    readCurrentRow({row, pos, wordLength}:Guess) {
        if(pos !== wordLength - 1) return;
        const cells = this.queryCells(row)
        if(cells[pos].textContent === "") return;
        return  cells.reduce((accum, curr)=> accum + curr.textContent, "");
    }
    queryCells(row:number) {
        const rowEl = document.querySelector(`[data-row="${row}"]`) as HTMLDivElement;
        console.log(rowEl)
        return [...rowEl.children] as HTMLDivElement[];
    }

    showError(msg:string) {
        const small = document.createElement("small");
        small.className = "error";
        small.textContent = msg;
        (document.querySelector("#app") as HTMLDivElement).prepend(small);
    }
    hideError() {
        const err = document.querySelector(".error");
        if(err) {
            err.remove()
        }
    }
    updateClassname(classStr:string, node:HTMLDivElement) {
        node.className = "cell " + classStr;
        const keyEl = this.rootEl.querySelector<HTMLDivElement>(`[data-key="${node.textContent}"]`);
        if(!keyEl) return;
        keyEl.className = "key " + classStr
    }
    updateTimeCount(timeStr:string) {
        let timeCount = this.rootEl.querySelector<HTMLParagraphElement>(".timer") as HTMLParagraphElement;

        timeCount.textContent = `You have been guessing for: ${timeStr}`;


    }
    @autoBind
    toggleTimer() {
        (this.rootEl.querySelector<HTMLParagraphElement>(".timer") as HTMLParagraphElement).classList.toggle("show");
    }
    @autoBind
    swapButtons() {
        const keyboardEl = this.rootEl.lastElementChild;
        if (!keyboardEl) return;

        let line = keyboardEl.lastElementChild;
        if (!line) return;

        let firstEl = line.firstElementChild;
        let lastEl = line.lastElementChild;

        if (!firstEl || !lastEl) return;
        line.insertBefore(lastEl, line.firstChild);
        line.appendChild(firstEl);
    }
    highContrast() {

    }



}