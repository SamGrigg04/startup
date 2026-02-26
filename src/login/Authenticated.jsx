export function Authenticated({ userName, onLogout }) {
  return (
    <div>
      <p>Logged in as {userName}</p>
      <button className="btn btn-primary" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}