import React from 'react';
import { AuthState } from '../AuthState';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';

export function Login({ userName, authState, onAuthChange }) {
  return (
    <main>
      <div>
      {authState !== AuthState.Unknown && <h1 class="page-title">Welcome to NumbrGuessr</h1>}
      {authState === AuthState.Authenticated && <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />}
      {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />        
          )}
      </div>
      {/* <form method="get" action="home.html">
        <div>
          <input type="text" placeholder="Username" />
        </div>
        <div>
          <input type="password" placeholder="Password" />
        </div>
        <div>
          <button type="button" class="btn btn-primary" id="login-btn">Login</button>
        </div>
        <div>
          <button type="button" class="btn btn-primary" id="create-acc">Create Account</button>
        </div>
      </form> */}
    </main>
  );
}