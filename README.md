# Wordle Clone

My own implementation of popular word guessing game in vanilla TypeScript with HTML and CSS.
Wordle is a word-guessing game where a player attempts to guess a secret word within a limited number of attempts.

The goal of this project was to widen and deepen hands-on experience with vanilla Typescript, solidify my understanding of MVP architectural pattern and improve overall DOM-manipulation skills.

## Features

- ### Word input + Validation:
- User can either input letters by mouse-clicking on UI keyboard element or directly type on a keyboard.
- Word validation is achieved through sending an HTTP request to external words API. In case attempted word is not valid(doesn't exist), corresponding feedback will be provided to user by UI.
    Otherwise, game board and keyboard elements will be updated according to correctness of a guess.

- ### Additional game settings
- User can swap backspace and enter keys, change the length of the hidden word, whether to show or not current guess duration(stopwatch) and contrast level of the UI elements(keys and letters). He can also choose to play on hard/extra hard modes.

- ### Advanced difficulty levels
- User can play the game on 3 difficulty modes: easy, hard and extra hard.
- ** Easy mode **
- This is the default game mode. No limits are set on user's guess attempt.
- ** Hard mode **
- Player must take into account previously revealed hints(Correctly placed letters from previous attempt must be placed at the same position, guessed letters must be used)
- ** Extra hard mode **
- Settings from hard mode + Revealed letters must be moved away from previous positions and gray clues must be obeyed(letters not present in word cannot be used)

- ### Observer pattern utilization
- The Observer Pattern is extensively employed in managing the state of game settings. The `settings` object serves as the subject, and various components(View, Presenter) act as observers, responding to changes in settings.
- The project leverages the Observer Pattern to establish a flexible and responsive communication mechanism between different components, ensuring fluid synchronization when specific states are altered.

- ## Project structure
- ### MVP pattern utilization
- **The project structure adheres to the Model-View-Presenter (MVP) architectural pattern, providing a clear separation of concerns and promoting maintainability.**
- #### Key Components and Responsibilities:

- **Model:**
    - The `Model` encapsulates the core logic of the Wordle game, handling game state management. It serves as the data layer, independent of the user interface.

- **View:**
    - The `View` is responsible for presenting the game to the user and capturing user interactions. It reflects the current state of the game to the user and updates based on changes triggered by the Presenter.

- **Presenter:**
    - The `Presenter` acts as an intermediary between the Model and the View, orchestrating the flow of information. It receives user input from the View, manipulates the Model accordingly, and updates the View to reflect changes in the game state.

- #### Additional models implemented:
- **Word**
- This model is intended to encapsulate logic related to word generation and validation through communication with external API.
- **Settings**
- Settings model handles settings-specific functionality(rendering UI elements and managing settings state)



## Demo



## Technologies Used

- TypeScript
- HTML
- CSS
- Vite