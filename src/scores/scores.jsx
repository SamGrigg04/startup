import React from 'react';
import './scores.css';
import { GameEvent, GameNotifier } from './gameNotifier';

export function Scores(props) {
  const userName = props.userName;
  const [localScores, setLocalScores] = React.useState([]); // Scores for the local leaderboard
  const [globalScores, setGlobalScores] = React.useState([]); // Scores for the global leaderboard
  const [showGlobal, setShowGlobal] = React.useState(false); // So you can switch between leaderboards

  // Initialize the local leaderboard
  React.useEffect(() => {
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      setLocalScores(JSON.parse(scoresText));
    }
  }, []);

  // Update the local leaderboard upon a game ending
  React.useEffect(() => {
    function handleEvent(event) {
      if (event.type === GameEvent.End) { // when a game ends
        setGlobalScores(prev =>
          insertScore(prev, event.value)
        );
      }
    }

    GameNotifier.addHandler(handleEvent);
    return () => GameNotifier.removeHandler(handleEvent);
  }, []);

  // Switch between global and local every 5 seconds
  React.useEffect(() => {
    const id = setInterval(() => {
      setShowGlobal(prev => !prev);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  // This makes the leaderboard procedurally otherwise there would be a *ton* of
  // duplicated code (trust me, I speak from experience)
  function LeaderboardTable({ scores }) {
    return (
      <table>
        <thead>
          <tr>
            <th>Place</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{scores[i]?.userName ?? "--"}</td>
              <td>{scores[i]?.time ?? "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }


  return (
    <main>
      <h1 className="page-title">How do you measure up, {userName}?</h1>
      <div id="leaderboard">
        {/* This is neat, it changes the class name to hidden or visible based on the showGlobal variable */}
        <div className={`board ${showGlobal ? "hidden" : "visible"}`}>
          <h2>Personal Best</h2>
          <LeaderboardTable scores={localScores} />
        </div>

        <div className={`board ${showGlobal ? "visible" : "hidden"}`}>
          <h2>Global Leaderboard</h2>
          <LeaderboardTable scores={globalScores} />
        </div>
      </div>
    </main>
  );
}