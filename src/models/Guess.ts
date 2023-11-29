import {autoBind} from "../utils/decorator.ts";

interface ICount {minutes:number, seconds:number};
const defaultTimeCount:ICount = {
    minutes:0,
    seconds:0
}
export interface IGuess {
    row:number,
    pos:number,
    attempts:number,
    wordLength:number,
    isError:boolean,
    timeOut:number|null,
    timeCount:ICount;
    isStarted:boolean
    recentAttempt:RecentAttempt,
    recentAttempts:RecentAttempt[],
    recentAttemptArr:IRecentAttempt[]
    previousAttemptsArrays:IRecentAttempt[][]
}
export type Timeout = ReturnType<typeof setTimeout>;
export type Interval = ReturnType<typeof setInterval>;

export type IRecentAttempt =  {
    letter:string,
    limit:"correct"|"almost"|"disabled"
}
export type RecentAttempts<Key extends keyof RecentAttempt = number> = RecentAttempt[Key][]
export interface RecentAttempt  {[Key: number]: { letter:string, limit:"correct"|"almost"|"disabled" }}
export class Guess implements IGuess{
    public row = 0;
    public pos = 0;
    public timeOut:number | null= null;
    public isError = false;
    public timeCount = defaultTimeCount;
    public isStarted = false;
    public recentAttempt;
    public recentAttempts;
    public recentAttemptArr:IRecentAttempt[] = [];
    public previousAttemptsArrays:IRecentAttempt[][] = [];
    public attempts= 5;
    public intervalID:Interval|null = null;

    constructor(public wordLength:number, private word:string) {
    this.recentAttempt= {}
    this.recentAttempts= []
    }
    handleLetterInput() {
        if(this.pos === this.wordLength - 1) return;
        this.pos++;
        console.log(this.pos)
    }
    handleDelete() {
        if(this.pos === 0) return;
        this.pos--;
    }
    handleSubmit(currWord:string) {
        if(this.pos!==this.wordLength - 1) return;
        if(currWord === this.word) {
            //this.resetState();
            return true
        }
        if(this.row + 1 === this.attempts) {
            return false;
        }
        this.row++;
        this.resetPos()

    }
    resetPos() {
        this.pos = 0;
    }
    removeError(){
        this.isError = false;
        if(this.timeOut !== null) {
            window.clearTimeout(this.timeOut);
            this.timeOut = null;
        }

    }
    setError() {
        this.isError = true;

    }
    updateTimer() {
        console.log("updating")
        let {minutes, seconds} = this.timeCount;
        let newSeconds = seconds + 1;
        if(newSeconds===60) {
            newSeconds = 0;
            minutes++;
        }
        this.timeCount ={minutes, seconds: newSeconds}

    }
    @autoBind
    resetState() {
        this.pos = 0;
        this.row = 0;
        this.isStarted = false;
        if(this.isError) {
            this.isError = false;
        }

        if(this.attemptArr.length) {
            this.attemptArr = []
        }
        if(this.prevAttempts.length) {
            this.previousAttemptsArrays = []
        }
        this.timeCount = defaultTimeCount;
        if(this.interval) {
            window.clearInterval(this.interval);
            this.interval = null;
        }

    }
    get attemptArr():IRecentAttempt[] {
        return this.recentAttemptArr
    }
    set attemptArr(newArr) {
        this.recentAttemptArr = newArr
    }
    get prevAttempts():IRecentAttempt[][] {
        return this.previousAttemptsArrays
    }
    set prevAttempts(newAttemptArr){
        this.previousAttemptsArrays.push((newAttemptArr as unknown) as IRecentAttempt[])
    }
    set interval(newID:Interval|null) {
        this.intervalID = newID
    }
    get interval() {
        return this.intervalID
    }
}