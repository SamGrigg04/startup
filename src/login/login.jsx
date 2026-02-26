import React from 'react';
import { AuthState } from '../AuthState';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';

export function Login({ userName, authState, handleAuthChange }) {
  return (
  //   <div>
  //     <h1>LOGIN RENDER TEST</h1>;

  //   </div>
  // );
    <main>
      <div>
      {authState !== AuthState.Unknown && <h1 className="page-title">Welcome to NumbrGuessr</h1>}
      {authState === AuthState.Authenticated && <Authenticated userName={userName} onLogout={() => handleAuthChange(userName, AuthState.Unauthenticated)} />}
      {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              handleAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />        
          )}
      </div>
    </main>
  );
}