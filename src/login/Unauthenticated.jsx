import React from 'react';
import './Unauthenticated.css';

export function Unauthenticated({ userName: initialUserName = '', onLogin }) {
  const [userName, setName] = React.useState(initialUserName ?? '');
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
      body: JSON.stringify({ email: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      onLogin(userName);
    }
  }

  return (
    <div className="unauthenticated">
      <input
        type="text"
        placeholder="Username"
        value={userName}
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
          disabled={!userName || !password}
        >
          Login
        </button>
        <button
          className="btn btn-primary"
          id="create"
          onClick={() => createUser()}
          disabled={!userName || !password}
        >
          Create
        </button>
      </div>
    </div>
  );
}