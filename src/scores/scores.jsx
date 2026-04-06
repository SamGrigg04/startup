import React from 'react';
import './scores.css';

export function Scores(props) {
  const name = props.name;
  const [localScores, setLocalScores] = React.useState([]); // Scores for the local leaderboard
  const [globalScores, setGlobalScores] = React.useState([]); // Scores for the global leaderboard
  const [showGlobal, setShowGlobal] = React.useState(false); // So you can switch between leaderboards

  React.useEffect(() => {
    fetch('/api/localScores')
      .then((response) => response.json())
      .then((scores) => {
        setLocalScores(scores);
      });
  }, []);

  React.useEffect(() => {
    fetch('/api/globalScores')
      .then((response) => response.json())
      .then((scores) => {
        setGlobalScores(scores);
      });
  }, []);

  // Switch between global and local every 10 seconds
  React.useEffect(() => {
    const id = setInterval(() => {
      setShowGlobal(prev => !prev);
    }, 10000);

    return () => clearInterval(id);
  }, []);

  function formatTime(ms) {
  if (typeof ms !== 'number') return "--";

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);

  return `${minutes.toString().padStart(2, '0')}:` +
         `${seconds.toString().padStart(2, '0')}:` +
         `${milliseconds.toString().padStart(2, '0')}`;
}

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
              <td>{scores[i] ? formatTime(scores[i].time) : "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <main>
      <h1 className="page-title">How do you measure up, {name}?</h1>
      <div id="leaderboard">
        {/* This is neat, it changes the class name to hidden or visible based on the showGlobal variable */}
        <div className={`board ${showGlobal ? "hidden" : "visible"}`}>
          <h2>Personal Best</h2>
          {/* localScores should be an array of objects */}
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
