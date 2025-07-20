// src/app/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Login failed');
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="container d-flex align-items-center justify-content-center min-vh-100 position-relative">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-circle">
                <span className="logo-text">SR12</span>
              </div>
            </div>
            <h2 className="login-title">Admin Login</h2>
            <p className="login-subtitle">Welcome back! Please sign in to continue.</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="username"
                className={`form-control custom-input ${error ? 'is-invalid' : ''}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <label htmlFor="username">Username</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                id="password"
                className={`form-control custom-input ${error ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            {error && (
              <div className="alert alert-danger custom-alert" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn custom-btn w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}