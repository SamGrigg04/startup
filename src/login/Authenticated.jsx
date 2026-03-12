import React from 'react';
import './Authenticated.css';

export function Authenticated({ name, onLogout }) {

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('name');
        onLogout();
      });
  }
  
  return (
    <div className="authenticated">
      <p>Logged in as {name}</p>
      <button className="btn btn-primary" id="logout" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
}