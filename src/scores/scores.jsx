import React from 'react';
import './scores.css';

export function Scores() {
  return (
    <main>
      <h1 class="page-title">How do you measure up, [USERNAME]?</h1>
      <div id="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Place</th>
              <th>Name</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><img src="first.png" alt="first" id="medal" /></td><td>[NAME]</td><td>[TIME]</td>
            </tr>
            <tr>
              <td><img src="second.png" alt="second" id="medal" /></td><td>[NAME]</td><td>[TIME]</td>
            </tr>
            <tr>
              <td><img src="third.png" alt="third" id="medal" /></td><td>[NAME]</td><td>[TIME]</td>
            </tr>
            <tr>
              <td>4th</td><td>[NAME]</td><td>[TIME]</td>
            </tr>
            <tr>
              <td>5th</td><td>[NAME]</td><td>[TIME]</td>
            </tr>
            <tr>
              <td>6th</td><td>[NAME]</td><td>[TIME]</td>
            </tr>
            <tr>
              <td>7th</td><td>[NAME]</td><td>[TIME]</td>
            </tr>
            <tr>
              <td>8th</td><td>[NAME]</td><td>[TIME]</td>
            </tr>
            <tr>
              <td>9th</td><td>[NAME]</td><td>[TIME]</td>
            </tr>
            <tr>
              <td>10th</td><td>[NAME]</td><td>[TIME]</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* <p id="database">The leaderboard uses database stuff and websocket for live updates</p> */}
    </main>
  );
}