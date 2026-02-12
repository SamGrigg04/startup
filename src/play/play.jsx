import React from 'react';
import './play.css';

export function Play() {
  return (
    <main>
      <h1 class="page-title">Welcome, [USERNAME]!</h1>
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
        <p>Fun Facts About the Number You Guessed http://numbersapi.com/</p>
      </div>

      <div id="websocket">
        <p>WEBSOCKET DATA GOES IN HERE SOMEWHERE?</p>
      </div>

    </main>
  );
}