import React from 'react';
import './Unauthenticated.css';
import { MessageDialog } from './messageDialog';

export function Unauthenticated({ name: initialName = '', onLogin }) {
  const [name, setName] = React.useState(initialName ?? '');
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      credentials: 'include',
      body: JSON.stringify({ email: name, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('name', name);
      onLogin(name);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <div className="unauthenticated">
      <input
        type="text"
        placeholder="Username"
        value={name}
        maxLength={100}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        maxLength={100}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <div>
        <button
          className="btn btn-primary "
          id="login"
          onClick={() => loginUser()}
          disabled={!name || !password}
        >
          Login
        </button>
        <button
          className="btn btn-primary"
          id="create"
            onClick={() => createUser()}
            disabled={!name || !password}
        >
          Create
        </button>
      </div>
      
      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    
    </div>
  );
}