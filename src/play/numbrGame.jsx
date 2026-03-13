import React from 'react';

import { Button } from 'react-bootstrap';
import { GameEvent, GameNotifier } from '../gameNotifier';
import { useTimer } from './timer'
import { APIcall } from './APIcall';
import './numbrGame.css';


export function NumbrGame(props) {
  const name = props.name;
  const [target, setTarget] = React.useState(() => getRandomInt()); // Sets the number the player will be guessing and saves it as target
  const [guess, setGuess] = React.useState(""); // Initialized the guess variable to be empty and the function to update the guess as setGuess()
  const [hint, setHint] = React.useState(""); // Initializes the hint to be empty and declares the function to update the hint as setHint()
  const [isCorrect, setIsCorrect] = React.useState(false); // They start as incorrect. We can change that with the setIsCorrect() function
  const [lastGuess, setLastGuess] = React.useState(""); // Just here for some nice UI stuff

  const {time, startTimer, stopTimer} = useTimer(); // Get all the time stuff from the timer.jsx

  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000); // since they're stored as miliseconds
  const milliseconds = Math.floor((time % 1000) / 10); // two digit display

  // even if they are only one digit, it will display as 2 with 0 as a placeholder
  const minutesStr = String(minutes).padStart(2, "0")
  const secondsStr = String(seconds).padStart(2, "0")
  const millisecondsStr = String(milliseconds).padStart(2, "0")

  // Returns a random integer between 1 and 1000
  function getRandomInt() {
    const min = 1;
    const max = 1000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const handleGuess = () => {
    const num = Number(guess); // set num to be the user input
    if (!guess || guess.trim() == "" || Number.isNaN(num) || isCorrect) return; // if there is no guess or it is empty or it is not a number or you already got it, do nothing. return early

    setLastGuess(num); // for UI stuff
    startTimer();

    // Logic for the dynamic hint
    if (num < target) {
      setHint("higher");
    } else if (num > target) {
      setHint("lower");
    } else {
      setHint("correct");
      setIsCorrect(true); // Also disables the button so they can't keep guessing
      stopTimer()
      
      const timeStr = `${minutesStr}:${secondsStr}:${millisecondsStr}`;
      const scoreObj = { name: name, time: timeStr };

      // Saves the result to local storage as a string and updates the leaderboard
      updateScoresLocal(scoreObj);
      
      GameNotifier.broadcastEvent(name, GameEvent.End, scoreObj);
    }
  };

  // Updates the leaderboard
  async function updateScoresLocal(newScore) {

    await fetch('/api/score', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newScore),
    });
  }

  return (
    <div className='game'>
        <h1 className="page-title">Welcome, {name}!</h1> 

        <div id="hint" className={hint}> {/* This is neat, it lets us change the styling based on what the hint is */}
            <p>
              {/* Display different things depending on whether the answer is correct, higher, or lower */}
              {/* Seriously React, get a handle on your weird syntax */}
              {isCorrect ? `Congratulations, ${lastGuess} is correct!` : hint ? `The answer is ${hint} than ${lastGuess}!` : "Make a guess..."} 
            </p>
        </div>

        <form
        // Makes it not screw everything up when you hit enter
          onSubmit={(e) => {
            e.preventDefault();
            handleGuess();
          }}
        >
            <div>
                <input 
                type="number" 
                placeholder="Your guess..." 
                value={guess}
                maxLength={4}
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
                  GUESS {target}
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
            <APIcall number={lastGuess}></APIcall>
        </div>
    </div>
  );
}
