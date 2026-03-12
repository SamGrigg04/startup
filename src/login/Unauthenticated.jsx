import React from 'react';
import './Unauthenticated.css';

export function Unauthenticated({ name: initialName = '', onLogin }) {
  const [name, setName] = React.useState(initialName ?? '');
  const [password, setPassword] = React.useState('');

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
    }
  }

  return (
    <div className="unauthenticated">
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
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
    </div>
  );
}