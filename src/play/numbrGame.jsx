import React from 'react';

import { Button } from 'react-bootstrap';
import { GameEvent, GameNotifier } from './gameNotifier';
// import {} from './APIcall';
// import {} from './guessButton';
import './numbrGame.css';

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

  const timerRef = React.useRef(null); // This is a reference to the running timer. It allows us to start and stop the timer
  const startedRef = React.useRef(false); // This makes it so only the first guess starts the timer
  const timestamp = React.useRef(null); // Stores the current system time

  // Resets the interval (timer) when they leave the page
  React.useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Returns a random integer between 1 and 1000
  function getRandomInt() {
    const min = 1;
    const max = 1000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

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

  const handleGuess = () => {
    const num = Number(guess); // set num to be the user input
    if (Number.isNaN(num)) return; // if it isn't a number, do nothing. return early

    startTimer();

    // Let other players know a new game has started
    GameNotifier.broadcastEvent(userName, GameEvent.Start, {});

    // Logic for the dynamic hint
    if (num < target) {
      setHint("higher");
    } else if (num > target) {
      setHint("lower");
    } else {
      setHint("correct!");
      setIsCorrect(true); // Also disables the button so they can't keep guessing
      clearInterval(timerRef.current); // Stops the timer

      // Saves the result to local storage as a string and updates the leaderboard
      updateScoresLocal({
        userName,
        time,
        number: target,
        finishedAt: new Date().toISOString()
      });
    }
  };

  // Updates the leaderboard
  function updateScoresLocal(newScore) {
    let scores = [];

    // Gets the current data from the leaderboard
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      scores = JSON.parse(scoresText);
    }

    // Inserts the new score based off the time
    let found = false;
    for (const [i, prevScore] of scores.entries()) { // what a weird loop syntax. c'mon react
      if (newScore.time < prevScore.time) {
        scores.splice(i, 0, newScore);
        // found = true;
        break;
      }
    }

    // if the new score is the lowest, add it anyways
    if (!found) {
      scores.push(newScore);
    }

    // Keep the leaderboard to the top 10
    if (scores.length > 10) {
      scores.length = 10;
    }

    localStorage.setItem('scores', JSON.stringify(scores));
  }

  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000); // since they're stored as miliseconds
  const milliseconds = Math.floor((time % 1000) / 10); // two digit display

  // even if they are only one digit, it will display as 2 with 0 as a placeholder
  const minutesStr = String(minutes).padStart(2, "0")
  const secondsStr = String(seconds).padStart(2, "0")
  const millisecondsStr = String(milliseconds).padStart(2, "0")

  return (
    <div className='game'>
        <h1 className="page-title">Welcome, {userName}!</h1> 

        <div id="hint" className={hint}> {/* This is neat, it lets us change the styling based on what the hint is */}
            <p>
            {/* If the hint variable is empty, display placeholder text. Otherwise, display 'The answer is [hint]!' */}
            {hint ? `The answer is ${hint}!` : "Make a guess..."} {/* Seriously React, get a handle on your weird syntax */}
            </p>
        </div>

        <form>
            <div>
                <input 
                type="number" 
                placeholder="Your guess..." 
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                />
            </div>

            <div>
                <Button 
                  className="btn btn-primary" 
                  variant="primary"
                  id="guess-btn"
                  onClick={handleGuess}
                 >
                  GUESS
                </Button>
            </div>
        </form>

        <div id="timer">
            <h3>Your Time</h3>
            <div id="time">
                <span className="digit" id="min">{minutesStr}</span>
                <span className="txt">Min</span>
                <span className="digit" id="sec">{secondsStr}</span>
                <span className="txt">Sec</span>
                <span className="digit" id="mil">{millisecondsStr}</span>
                <span className="txt">Mil</span>
            </div>
        </div>

        <div id="api">
            {/* <p>{fact} Fun facts about the number you guessed here: http://numbersapi.com/</p> */}
        </div>

        <div id="websocket">
            <p>WEBSOCKET DATA GOES IN HERE SOMEWHERE?</p>
        </div>
    </div>
  );
}
