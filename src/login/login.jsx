import React from 'react';

import { AuthState } from '../authState';
import { Authenticated } from './authenticated';
import { Unauthenticated } from './unauthenticated';

export function Login({ name, authState, onAuthChange }) {
  return (
    <main>
      <div>
      {authState !== AuthState.Unknown && <h1 className="page-title">Welcome to NumbrGuessr</h1>}
      {authState === AuthState.Authenticated && <Authenticated name={name} onLogout={() => onAuthChange(name, AuthState.Unauthenticated)} />}
      {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            name={name}
            onLogin={(loginName) => {
              onAuthChange(loginName, AuthState.Authenticated);
            }}
          />        
          )}
      </div>
    </main>
  );
}