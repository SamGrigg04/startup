import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Scores } from './scores/scores';
import { AuthState } from './AuthState';


export default function App() {

  const storedUser = localStorage.getItem('userName');
  const [userName, setUserName] = React.useState(storedUser || '');
  // const [authState, setAuthState] = useState( storedUser ? AuthState.Authenticated : AuthState.Unauthenticated );
  const [authState, setAuthState] = React.useState(AuthState.Unauthenticated);

  function handleAuthChange(userName, newAuthState) {
    setAuthState(newAuthState);
    setUserName(userName);

    if (newAuthState === AuthState.Authenticated) {
      localStorage.setItem('userName', userName);
    } else {
      localStorage.removeItem('userName');
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
                userName={userName}
                authState={authState}
                onAuthChange={handleAuthChange}
              />
            } 
            exact 
          />
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
