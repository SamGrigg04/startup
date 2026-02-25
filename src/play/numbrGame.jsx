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

  const [allowPlayer, setAllowPlayer] = React.useState(false);

  async function onPressed(buttonPosition) {
    if (allowPlayer) {
      setAllowPlayer(false);
      await buttons.get(buttonPosition).ref.current.press();

      if (sequence[playbackPos].position === buttonPosition) {
        if (playbackPos + 1 === sequence.length) {
          setPlaybackPos(0);
          increaseSequence(sequence);
        } else {
          setPlaybackPos(playbackPos + 1);
          setAllowPlayer(true);
        }
      } else {
        saveScore(sequence.length - 1);
        mistakeSound.play();
        await buttonDance();
      }
    }
  }

  async function reset() {
    setAllowPlayer(false);
    setPlaybackPos(0);
    await buttonDance(1);
    increaseSequence([]);

    // Let other players know a new game has started
    GameNotifier.broadcastEvent(userName, GameEvent.Start, {});
  }

  function increaseSequence(previousSequence) {
    const newSequence = [...previousSequence, getRandomButton()];
    setSequence(newSequence);
  }

  // Demonstrates updating state objects based on changes to other state.
  // All setState calls are asynchronous and so you need to wait until
  // that state is updated before you can update dependent functionality.
//   React.useEffect(() => {
//     if (sequence.length > 0) {
//       const playSequence = async () => {
//         await delay(500);
//         for (const btn of sequence) {
//           await btn.ref.current.press();
//         }
//         setAllowPlayer(true);
//       };
//       playSequence();
//     }
//   }, [sequence]);

//   async function buttonDance(laps = 5) {
//     for (let step = 0; step < laps; step++) {
//       for (const btn of buttons.values()) {
//         await btn.ref.current.press(100, false);
//       }
//     }
//   }

  function getRandomButton() {
    let b = Array.from(buttons.values());
    return b[Math.floor(Math.random() * b.length)];
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
