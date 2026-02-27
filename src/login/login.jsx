import React from 'react';
import { AuthState } from '../AuthState';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';

export function Login({ userName, authState, onAuthChange }) {
  return (
    <main>
      <div>
      {authState !== AuthState.Unknown && <h1 className="page-title">Welcome to NumbrGuessr</h1>}
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
    </main>
  );
}