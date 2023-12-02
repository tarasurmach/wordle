import './style.css'
import {Presenter} from "./models/Presenter.ts";
import {Word} from "./models/Word.js";
import {Model} from "./models/Model.ts";
import {View} from "./models/View.js";
import {Settings} from "./models/Options.js";

const root = document.getElementById("app") as HTMLDivElement;
const options = new Settings(root)

const word = new Word(options.length);
const model = new Model(word.wordLength, word.word)
const view = new View(root)
const presenter = new Presenter(model, word, view, options);
options.subscribe("hard", presenter.startGame);
options.subscribe("extraHard", presenter.startGame);
options.subscribe("invertedKeys", view.swapButtons);
options.subscribe("highContrast", view.highContrast);
options.subscribe("length", presenter.startGame)
options.subscribe("showTimer", view.toggleTimer)



