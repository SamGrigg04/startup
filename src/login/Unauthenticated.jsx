import React from 'react';

export function Unauthenticated({ onLogin }) {
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={() => onLogin(name)}
        disabled={!name || !password}
      >
        Login
      </button>
    </div>
  );
}