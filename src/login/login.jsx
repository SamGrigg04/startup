import React from 'react';

export function Login() {
  return (
    <main>
      <h1 class="page-title">Welcome to NumbrGuessr</h1>
      <form method="get" action="home.html">
        <div>
          <input type="text" placeholder="Username" />
        </div>
        <div>
          <input type="password" placeholder="Password" />
        </div>
        <div>
          <button type="button" class="btn btn-primary" id="login-btn">Login</button>
        </div>
        <div>
          <button type="button" class="btn btn-primary" id="create-acc">Create Account</button>
        </div>
      </form>
    </main>
  );
}