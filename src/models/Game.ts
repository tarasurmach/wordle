import {Guess, IRecentAttempt} from "./Guess.js";

import {Word} from "./Word.js";
import {View} from "./View.js";
import {Options} from "./Options.js";
import {autoBind} from "../utils/decorator.ts";

export class Game {
    constructor(public guess:Guess, private word:Word, public view:View, private options:Options) {
        this.startGame().then();
    }
    @autoBind
    async startGame(restart=false) {
        this.guess.resetState()
        this.word.length = this.options.length
        await this.word.getWord();
        this.guess = new Guess(this.word.length, this.word.word)
        if(!restart) {
            this.view.renderContainer( this.handleInput, 5, this.options.length)
        }else {
            this.view.resetView()
        }
    }

    @autoBind
    handleLetterInput(key:string) {
        this.view.changeTextContent(key, this.guess)
        this.guess.handleLetterInput();
    }
    async handleEnter() {
        const currWord = this.view.readCurrentRow(this.guess)
        if(!currWord) return;
        const wordExists = await this.word.wordExists(currWord);
        if(!wordExists) {
            this.showError("Such a word doesn't exist");
            console.log("Such a word doesn't exist");
            return;
        }
        this.handleExtraHard(currWord)
        console.log(this.guess.row)
    }
    handleBackspace() {
        const cell = this.view.queryCell(this.guess);
        if(cell.textContent === "" && this.guess.pos === 0) return;
        if(cell.textContent !=="") {
            cell.textContent = ""
        }else {
            this.guess.handleDelete();
            this.view.queryCell(this.guess).textContent = ""

        }
    }
    @autoBind
    hideError() {
        this.guess.removeError();
        this.view.hideError()
    }
    showError(msg:string){
        this.guess.isError = true;
        this.guess.timeOut = window.setTimeout(this.hideError, 2000)
        this.view.showError(msg)
    }

    handleExtraHard(currWord:string) {
        const prevAttemptsArrays = this.guess.prevAttempts
        const prevAttemptArr = this.guess.attemptArr;
        const newAttemptArr:IRecentAttempt[] = [];
        const correctWord = this.word.wordLetters;
        let newAttemptObj:IRecentAttempt;
        const extraHard = this.options.extraHard;
        const hard = this.options.hard;
        for(let i = 0; i < currWord.length; i++) {
            const currLetter = currWord[i];
            const currCorrectLetter = correctWord[i];
            let shouldReturn = false;
            if(this.guess.row > 0 && (extraHard || hard)) {
                const {letter:prevLetter, limit} = prevAttemptArr[i];
                if(limit === "correct" && prevLetter !== currLetter) {
                    this.showError(`Letter ${i+1} must be ${prevLetter}`);
                    return
                }
                if(limit==="almost" && currLetter === prevLetter && extraHard) {
                    this.showError(`Letter ${i+1} cannot be ${prevLetter}`);
                    return
                } else if(limit==="almost" && !currWord.includes(prevLetter) ) {
                    console.log("almost")
                    this.showError(`Word must contain ${prevLetter}`);
                    return
                }

                if(extraHard) {
                    const disabledLetters = prevAttemptArr.find(({letter:bukva, limit:prevLimit})=> (currLetter === bukva) && prevLimit==="disabled" );
                    if(disabledLetters){
                        this.showError(`Word cannot contain ${disabledLetters.letter}`);
                        return
                    }
                    for (let j = 0; j < prevAttemptsArrays.length; j++) {
                        const attemptArray = prevAttemptsArrays[j];
                        attemptArray.forEach(({letter:nestedLetter, limit:nestedLimit}, index)=>{
                            if(nestedLimit==="almost" && nestedLetter === currLetter && index === i) {
                                console.log(`${nestedLetter}-${currLetter}    ${nestedLimit}-${limit}    ${i}`)
                                this.showError(`Letter ${i+1} cannot be ${nestedLetter}`);
                                shouldReturn = true
                                return
                            }
                        })
                    }
                }
            }

            if(shouldReturn) return;

            if(currLetter === currCorrectLetter) {
                newAttemptObj = {letter:currLetter, limit:"correct"};
            }else if (correctWord.includes(currLetter) ) {
                const occurs = correctWord.filter(bukva=> bukva === currLetter).length;
                if(((currWord.indexOf(currLetter) !== correctWord.indexOf(currLetter)) && occurs === 1) || occurs > 1) {
                    newAttemptObj= {letter:currLetter, limit:"almost"};
                }else  {
                    newAttemptObj ={letter:currLetter, limit:"disabled"};
                }
            }else {
                newAttemptObj ={letter:currLetter, limit:"disabled"};
            }
            newAttemptArr.push(newAttemptObj)
            }

        const cells = this.view.queryCells(this.guess.row);
        cells.forEach((cell, index)=>{
            this.view.updateClassname(newAttemptArr[index].limit, cell)
        })
        if(hard || extraHard) {
            this.guess.attemptArr = newAttemptArr;
            if(extraHard) {
                this.guess.prevAttempts = (newAttemptArr as unknown) as IRecentAttempt[][];
            }
        }
        const attempt = this.guess.handleSubmit(currWord)
        if(attempt === true){
            this.view.showModal(true, this.guess.row, this.word.word, this.getTimeCount(), this.startGame);

        }else if(attempt === false) {
            this.view.showModal(false, this.guess.row, this.word.word, this.getTimeCount(), this.startGame);

        }

    }
    getTimeCount() {
        const {minutes, seconds} = this.guess.timeCount;
        const secs = seconds < 10 ? `0${seconds}` : `${seconds}`;
        const mins = minutes < 10 ? `0${minutes}` : `${minutes}`;
        return [mins, secs]
    }
    handleTimeCountUpdate() {
        this.guess.interval = setInterval(()=>{
            if(!this.guess.isStarted) return;
            this.guess.updateTimer();
            if(this.options.showTimer) {
                this.view.updateTimeCount(this.getTimeCount());
            }
        }, 1000)
    }
    @autoBind
    handleInput(key:string) {
        if(this.guess.isError && this.guess.timeOut) {
            this.hideError();
        }
        switch (key) {
            case "Enter" : {
                console.log(this.guess)
                this.handleEnter().then();
                break;
            }
            case "Backspace": {
                this.handleBackspace();
                break;
            }
            default: {
                if(!(/^[a-zA-Z]$/.test(key))) return;
                this.handleLetterInput(key);
                if(!this.guess.isStarted) {
                    this.guess.isStarted = true
                    this.handleTimeCountUpdate()
                }
            }
        }
    }

}