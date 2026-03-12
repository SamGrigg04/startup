import './Authenticated.css';

export function Authenticated({ userName, onLogout }) {

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        onLogout();
      });
  }
  
  return (
    <div className="authenticated">
      <p>Logged in as {userName}</p>
      <button className="btn btn-primary" id="logout" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
}