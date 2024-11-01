import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const UserDashboardCase2 = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8800/api/usersCase2/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/auth', { replace: true });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>User Dashboard</h1>
        <div className="welcome-message">
          <h2>Welcome, User!</h2>
          <p>You are logged in with user privileges</p>
          <div className="user-info">
            <p>You have access to user-level features</p>
            <p>Your session is secured with HttpOnly cookies</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardCase2;