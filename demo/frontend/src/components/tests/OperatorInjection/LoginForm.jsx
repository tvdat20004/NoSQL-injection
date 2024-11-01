import React, { useState } from 'react';
import { ROUTES } from './config/routes';
import './LoginForm.css';

import { useNavigate } from 'react-router-dom';



const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8800/api/usersCase2/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        // Xác định URL mã hóa dựa trên role
        const encodedUrl = data.role === 'admin' ? ROUTES.ADMIN : ROUTES.USER;
        // Tạo URL đầy đủ
        //const fullUrl = `${window.location.origin}${encodedUrl}`;
        
        //Mở tab mới với URL đã mã hóa
        navigate(encodedUrl);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default LoginForm;