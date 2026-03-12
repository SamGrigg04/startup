import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Scores } from './scores/scores';
import { AuthState } from './authState';


export default function App() {

  const storedName = localStorage.getItem('name');
  const [name, setName] = React.useState(storedName || '');
  const [authState, setAuthState] = React.useState( storedName ? AuthState.Authenticated : AuthState.Unauthenticated );

  function handleAuthChange(newName, newAuthState) {
    setAuthState(newAuthState);
    setName(newName);

    if (newAuthState === AuthState.Authenticated) {
      localStorage.setItem('name', newName);
    } else {
      localStorage.removeItem('name');
    }
  }

  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <nav>
            <img src="tab_icon.png" alt="logo" id="logo" />
            <ul>
              <li><NavLink to="">Login</NavLink></li>
              {authState === AuthState.Authenticated && (
                <li><NavLink to="play">Play</NavLink></li>
              )}
              {authState === AuthState.Authenticated && (
                <li><NavLink to="scores">Scores</NavLink></li>
              )}
            </ul>
          </nav>
        </header>

        <Routes>
          <Route 
            path='/' 
            element={
              <Login 
                name={name}
                authState={authState}
                onAuthChange={handleAuthChange}
              />
            } 
            exact 
          />
          <Route path='/play' element={<Play name={name} />} />
          <Route path='/scores' element={<Scores name={name} />} />
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
