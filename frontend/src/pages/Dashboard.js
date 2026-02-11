import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome{user?.name ? `, ${user.name}` : ''}</h2>
        <p className="auth-subtitle">You are authenticated and ready to shop.</p>
        <button type="button" className="btn btn-primary btn-block" onClick={() => logout(true)}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
