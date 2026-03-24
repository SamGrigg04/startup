import React from 'react';
import './scores.css';
import { GameEvent, GameNotifier } from '../gameNotifier';

export function Scores(props) {
  const name = props.name;
  const [localScores, setLocalScores] = React.useState([]); // Scores for the local leaderboard
  const [globalScores, setGlobalScores] = React.useState([]); // Scores for the global leaderboard
  const [showGlobal, setShowGlobal] = React.useState(false); // So you can switch between leaderboards

  // Initialize the local leaderboard
  React.useEffect(() => {
    fetch('/api/localScores')
      .then((response) => response.json())
      .then((scores) => {
        setLocalScores(scores);
      })
      .catch((err) => {
          console.error('Failed to load local scores:', err);
      });
  }, []);

  // Initialize the global leaderboard
  React.useEffect(() => {
    fetch('/api/globalScores')
      .then((response) => response.json())
      .then((scores) => {
        setGlobalScores(scores);
      })
      .catch((err) => {
          console.error('Failed to load global scores:', err);
      });
  }, []);

  // Update leaderboards upon a game ending
  React.useEffect(() => {
    const handler = (event) => {
      if (event.type == GameEvent.End) { // When a game ends
        fetch('/api/globalScores')
          .then((response) => response.json())
          .then((scores) => {
            updateGlobalScores(scores);
          })
        
        fetch('/api/localScores')
          .then((response) => response.json())
          .then((scores) => {
            updateLocalScores(scores);
          })
      }
    };
    GameNotifier.addHandler(handler);
    return () => GameNotifier.removeHandler(handler);
  }, []);

  // Updates the leaderboard
  async function updateLocalScores(newScore) {
    await fetch('/api/localScore', {
      method: 'POST',
      // credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newScore),
    });
  }

  async function updateGlobalScores(newScore) {
    await fetch('/api/globalScore', {
      method: 'POST',
      // credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newScore),
    });
  }

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
    function getPlaceDisplay(place) {
      // place is 1-indexed (1, 2, 3, etc.)
      if (place < 4) {
        if (place == 1) {
          return <img src="first.png" alt="1st place" style={{ height: '30px' }} />;
        }
        if (place == 2) {
          return <img src="second.png" alt="2nd place" style={{ height: '30px' }} />;
        }
        if (place == 3) {
          return <img src="third.png" alt="3rd place" style={{ height: '30px' }} />;
        }
      }
      return place;
    }

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
              <td>{getPlaceDisplay(i + 1)}</td>
              <td>{scores[i]?.name ?? "--"}</td>
              <td>{scores[i]?.time ?? "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

//   // Simulate some scores for the Global leaderboard
//   function fakeScore() {
//     const randomMilliseconds = Math.floor(Math.random() * 1000);

//     const users = ['Abe', 'Babe', 'Cabe', 'Dave', 'Egg'];
//     const name = users[Math.floor(Math.random() * users.length)];

//   return { name, time: randomMilliseconds};
// }

//   // Display the fake scores at an interval
//   React.useEffect(() => {
//     const interval = setInterval(() => {
//       const score = fakeScore();
//       GameNotifier.broadcastEvent(score.name, GameEvent.End, score);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

  return (
    <main>
      <h1 className="page-title">How do you measure up, {name}?</h1>
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
