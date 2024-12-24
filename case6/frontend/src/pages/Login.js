import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Kiểm tra xem input có phải là NoSQL injection không
            let payload;
            try {
                // Thử parse input như JSON
                payload = {
                    username: JSON.parse(username),
                    password: JSON.parse(password)
                };
            } catch {
                // Nếu không parse được, coi như đăng nhập bình thường
                payload = {
                    username: username,
                    password: password
                };
            }

            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error('Login failed');
            }

            const data = await res.json();
            if (data.token) {
                login(data.token, data.isAdmin);
                navigate('/posts');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='username'
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="text" // Đổi type thành text để có thể nhập JSON
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='password'
                    />
                </div>
                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    );
}

export default Login;