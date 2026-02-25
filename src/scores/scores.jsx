import React from 'react';
import './scores.css';
import { GameEvent, GameNotifier } from './gameNotifier';

export function Scores(props) {
  const userName = props.userName;
  const [localScores, setLocalScores] = React.useState([]); // Scores for the local leaderboard
  const [globalScores, setGlobalScores] = React.useState([]); // Scores for the global leaderboard
  const [showGlobal, setShowGlobal] = React.useState(false); // So you can switch between leaderboards


  return (
    <main>
      <h1 className="page-title">How do you measure up, {userName}?</h1>
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
            {/* does it exist? If so, display it. If not, display the specified string */}
            <tr>
              <td><img src="first.png" alt="first" id="medal" /></td><td>{localScores[0]?.userName ?? "--"}</td><td>{localScores[0]?.time ?? "--"}</td>
            </tr>
            <tr>
              <td><img src="second.png" alt="second" id="medal" /></td><td>{localScores[1]?.userName ?? "--"}</td><td>{localScores[1]?.time ?? "--"}</td>
            </tr>
            <tr>
              <td><img src="third.png" alt="third" id="medal" /></td><td>{localScores[2]?.userName ?? "--"}</td><td>{localScores[2]?.time ?? "--"}</td>
            </tr>
            <tr>
              <td>4th</td><td>{localScores[3]?.userName ?? "--"}</td><td>{localScores[3]?.time ?? "--"}</td>
            </tr>
            <tr>
              <td>5th</td><td>{localScores[4]?.userName ?? "--"}</td><td>{localScores[4]?.time ?? "--"}</td>
            </tr>
            <tr>
              <td>6th</td><td>{localScores[5]?.userName ?? "--"}</td><td>{localScores[5]?.time ?? "--"}</td>
            </tr>
            <tr>
              <td>7th</td><td>{localScores[6]?.userName ?? "--"}</td><td>{localScores[6]?.time ?? "--"}</td>
            </tr>
            <tr>
              <td>8th</td><td>{localScores[7]?.userName ?? "--"}</td><td>{localScores[7]?.time ?? "--"}</td>
            </tr>
            <tr>
              <td>9th</td><td>{localScores[8]?.userName ?? "--"}</td><td>{localScores[8]?.time ?? "--"}</td>
            </tr>
            <tr>
              <td>10th</td><td>{localScores[9]?.userName ?? "--"}</td><td>{localScores[9]?.time ?? "--"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}