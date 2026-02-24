import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Scores } from './scores/scores';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <nav>
            <img src="tab_icon.png" alt="logo" id="logo" />
            <ul>
              <li><NavLink to="">Login</NavLink></li>
              <li><NavLink to="play">Play</NavLink></li>
              <li><NavLink to="scores">Scores</NavLink></li>
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Login />} exact />
          <Route path='/play' element={<Play />} />
          <Route path='/scores' element={<Scores />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
          <span>Author Name: Samuel Grigg &nbsp;&nbsp;&nbsp;&nbsp;</span>
          <div>
            <a href="https://github.com/SamGrigg04/startup/tree/main">GitHub</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main>404: Return to sender. Address unknown.</main>;
}
