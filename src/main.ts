import './style.css'
import {Game} from "./models/Game.js";
import {Word} from "./models/Word.js";
import {Guess} from "./models/Guess.js";
import {View} from "./models/View.js";
import {Options} from "./models/Options.js";

const root = document.getElementById("app") as HTMLDivElement;
const options = new Options(root)

const word = new Word(options.length);
const obj = new Guess(word.wordLength, word.word)
const view = new View(root)
const game = new Game(obj, word, view, options);
options.subscribe("hard", game.startGame);
options.subscribe("extraHard", game.startGame);
options.subscribe("invertedKeys", view.swapButtons);
options.subscribe("highContrast", view.highContrast);
options.subscribe("length", game.startGame)
options.subscribe("showTimer", view.toggleTimer)



