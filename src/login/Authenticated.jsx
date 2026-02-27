import './Authenticated.css';

export function Authenticated({ userName, onLogout }) {
  return (
    <div className="authenticated">
      <p>Logged in as {userName}</p>
      <button className="btn btn-primary" id="logout" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}