
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_KEY,
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
    }
};
export class Word {
    public wordLetters:string[];
    public word:string;
    public wordLength:number;
    constructor(wordLength=5) {
        this.wordLength = wordLength
    }
    async getWord() {
        console.log(import.meta.env)
        const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${this.wordLength}`);
        if(!response.ok) throw new Error("Unable to fetch word")
        const [word]:string = await response.json();
        if(!(word.length>0)) return;
        this.word = word.toUpperCase()
        this.wordLetters = this.word.split("")
    }
    async wordExists(word:string):Promise<boolean> {
        if(this.word.length === 0) return false;
        console.log(word)
        try {
            const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word.toLowerCase()}`, options);
            console.log(response)
            return true;
        }catch (e) {
             console.error(e);
             return false
        }


    }
    set length(newLength:number) {
        this.wordLength = newLength;
    }
    get length () {
        return this.wordLength
    }

}