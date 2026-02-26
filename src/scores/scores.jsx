import React from 'react';
import './scores.css';
import { GameEvent, GameNotifier } from '../gameNotifier';

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

  // convert time from a string to milliseconds for comparison in a sec
  function timeToMs(timeStr) {
    const [min, sec, mil] = timeStr.split(':').map(Number);
    return min * 60000 + sec * 1000 + mil * 10;
  }

  // Update the global and local leaderboard upon a game ending
  React.useEffect(() => {
    const handler = (event) => {
      if (event.type == GameEvent.End) { // When a game ends (we do the broadcast thing in numbrGame.jsx)
        // Update global
        setGlobalScores(prev => {
          const newScores = [...prev, event.value]; // add the new score (we can't just update the old array because react won't notice so there is this weird syntax)
          newScores.sort((a, b) => timeToMs(a.time) - timeToMs(b.time)); // sort by time (takes two items and comparest the time. lowest goes first)
          return newScores.slice(0, 10); // keep top 10
        });
        // Update local
        setLocalScores(prev => {
          const newScores = [...prev, event.value];
          newScores.sort((a,b) => timeToMs(a.time) - timeToMs(b.time));
          return newScores.slice(0, 10);
        });
      }
    };

    GameNotifier.addHandler(handler);
    return () => GameNotifier.removeHandler(handler);
  }, []);

  // Switch between global and local every 10 seconds
  React.useEffect(() => {
    const id = setInterval(() => {
      setShowGlobal(prev => !prev);
    }, 10000);

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

  // Simulate some scores for the Global leaderboard
  function fakeScore() {
    const randomMinutes = Math.floor(Math.random() * 5);
    const randomSeconds = Math.floor(Math.random() * 60);
    const randomMilliseconds = Math.floor(Math.random() * 100);
    const timeStr = `${String(randomMinutes).padStart(2, '0')}:${String(randomSeconds).padStart(2,'0')}:${String(randomMilliseconds).padStart(2,'0')}`;

    const users = ['Abe', 'Babe', 'Cabe', 'Dave', 'Egg'];
    const userName = users[Math.floor(Math.random() * users.length)];

  return { userName, time: timeStr};
}

  // Display the fake scores at an interval
  React.useEffect(() => {
    const interval = setInterval(() => {
      const score = fakeScore();
      GameNotifier.broadcastEvent(score.userName, GameEvent.End, score);
    }, 5000); // every 5 seconds just for testing TODO: Change interval

    return () => clearInterval(interval);
  }, []);

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
          <p>eventually this will read from a database, but for now it resets every time the page reloads</p>
        </div>
      </div>
    </main>
  );
}