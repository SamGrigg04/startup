import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <nav>
            <img src="images/tab_icon.png" alt="logo" id="logo" />
            <ul>
              <li><a href="index.html">Login</a></li>
              <li><a href="play.html">Play</a></li>
              <li><a href="scores.html">Scores</a></li>
            </ul>
          </nav>
        </header>

        <main>App Components Here</main>

        <footer>
          <span>Author Name: Samuel Grigg &nbsp;&nbsp;&nbsp;&nbsp;</span>
          <div>
            <a href="https://github.com/SamGrigg04/startup/tree/main">GitHub</a>
          </div>
        </footer>
      </div>;
    </BrowserRouter>
  );
}
