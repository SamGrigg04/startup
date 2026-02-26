import React from 'react';

export function Unauthenticated({ onLogin }) {
  const [name, setName] = React.useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={() => onLogin(name)}
        disabled={!name}
      >
        Login
      </button>
    </div>
  );
}