import React from 'react';

import { Button } from 'react-bootstrap';
import { GameEvent, GameNotifier } from './gameNotifier';
import {} from './hint';
import {} from './APIcall';
import {} from './guessButton';

/*
Makes the game functional.
Contains the logic for the input and button press
Makes the API call for the hint work
Returns a value for the username display
Updates the hint for the user
*/

export function NumbrGame(props) {
  const userName = props.userName;
  const [target, setTarget] = React.useState(() => getRandomInt()); // Sets the number the player will be guessing and saves it as target
  const [guess, setGuess] = React.useState(""); // Initialized the guess variable to be empty and the function to update the guess as setGuess()
  const [hint, setHint] = React.useState(""); // Initializes the hint to be empty and declares the function to update the hint as setHint()
  const [time, setTime] = React.useState(0); // Sets the time at zero and the function to change that as setTime()
  const [isCorrect, setIsCorrect] = React.useState(false); // They start as incorrect. We can change that with the setIsCorrect() function

  const timerRef = useRef(null); // This is a reference to the running timer. It allows us to start and stop the timer
  const startedRef = useRef(false); // This makes it so only the first guess starts the timer
  const timestamp = useRef(null); // Stores the current system time

  // Resets the interval (timer) when they leave the page
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Starts the timer once the user makes the first guess
  const startTimer = () => {
    if (!startedRef.current) { // If the timer isn't already going (stops the timer from starting over every time they guess)
      startedRef.current = true; // Set the flag so we don't run the timer again
      timestamp.current = Date.now(); // Sets the timestamp to the current time

      timerRef.current = setInterval(() => {
        setTime(Date.now() - timestamp.current); // Updates time to the elapsed time
      }, 16); // Visually updates the timer ~60 times/second
    } // Now timerRef is a reference to the timer currently running so we can stop it later
  };


  async function onPressed(buttonPosition) {
    
  }

  async function reset() {
    setGuess("");
    setHint("");
    setTime(0);
    setIsCorrect(false);

    // Let other players know a new game has started
    GameNotifier.broadcastEvent(userName, GameEvent.Start, {});
  }

  // Returns a random integer between 1 and 1000
  function getRandomInt() {
    min = 1;
    max = 1000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async function saveScore(score) {
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    // Let other players know the game has concluded
    GameNotifier.broadcastEvent(userName, GameEvent.End, newScore);

    updateScoresLocal(newScore);
  }

  function updateScoresLocal(newScore) {
    let scores = [];
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      scores = JSON.parse(scoresText);
    }

    let found = false;
    for (const [i, prevScore] of scores.entries()) {
      if (newScore.score > prevScore.score) {
        scores.splice(i, 0, newScore);
        found = true;
        break;
      }
    }

    if (!found) {
      scores.push(newScore);
    }

    if (scores.length > 10) {
      scores.length = 10;
    }

    localStorage.setItem('scores', JSON.stringify(scores));
  }

  // We use React refs so the game can drive button press events
  buttons.set('button-top-left', { position: 'button-top-left', ref: React.useRef() });
  buttons.set('button-top-right', { position: 'button-top-right', ref: React.useRef() });
  buttons.set('button-bottom-left', { position: 'button-bottom-left', ref: React.useRef() });
  buttons.set('button-bottom-right', { position: 'button-bottom-right', ref: React.useRef() });

  const buttonArray = Array.from(buttons, ([key, value]) => {
    return <SimonButton key={key} ref={value.ref} position={key} onPressed={() => onPressed(key)}></SimonButton>;
  });

  return (
    <div className='game'>
        <h1 class="page-title">Welcome, {userName}!</h1> 

        <div id="hint">
            <p>
            HINT GOES HERE
            </p>
        </div>

        <form>
            <div>
                <input type="number" placeholder="Your guess..." />
            </div>

            <div>
                <button class="btn btn-primary" type="submit" id="guess-btn">GUESS</button>
            </div>
        </form>

        <div id="timer">
            <h3>Your Time</h3>
            <div id="time">
                <span class="digit" id="min">00</span>
                <span class="txt">Min</span>
                <span class="digit" id="sec">00</span>
                <span class="txt">Sec</span>
                <span class="digit" id="mil">00</span>
                <span class="txt">Mil</span>
            </div>
        </div>

        <div id="api">
            <p>{fact} Fun facts about the number you guessed here: http://numbersapi.com/</p>
        </div>

        <div id="websocket">
            <p>WEBSOCKET DATA GOES IN HERE SOMEWHERE?</p>
        </div>
    </div>
  );
}
