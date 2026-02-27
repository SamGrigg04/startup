import React from 'react';
import './Unauthenticated.css';

export function Unauthenticated({ onLogin }) {
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

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
          onClick={() => onLogin(name)}
          disabled={!name || !password}
        >
          Login
        </button>
        <button
          className="btn btn-primary"
          id="logout"
          onClick={() => onLogin(name)}
          disabled={!name || !password}
        >
          Create
        </button>
      </div>
    </div>
  );
}