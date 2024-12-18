import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Kiểm tra URL params khi component mount
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('resetToken');
        const usernameFromUrl = searchParams.get('username');

        // Nếu có cả username và resetToken trong URL
        if (usernameFromUrl && tokenFromUrl) {
            verifyResetToken(usernameFromUrl, tokenFromUrl);
        }
    });

    const verifyResetToken = async (username, token) => {
        try {
            const response = await fetch('http://localhost:8800/api/vulnerable/case4/verify-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, resetToken: token })
            });

            const data = await response.json();

            if (data.success) {
                // Nếu token hợp lệ, chuyển đến trang reset password
                navigate(`/test/extract-unknowfield/vulnerable/reset-password?username=${username}&token=${token}`);
            } else {
                // Nếu token không hợp lệ, hiển thị lỗi
                setError('Invalid reset token');
            }
        } catch (err) {
            setError('An error occurred while verifying the token');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8800/api/vulnerable/case4/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            const data = await response.json();

            if (response.ok) {
                alert('If an account exists with that username, a password reset link will be sent.');
                setUsername('');
            } else {
                setError(data.message || 'An error occurred');
            }
        } catch (err) {
            setError('An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h2>Reset Password</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                            className="form-input"
                            placeholder="Enter your username"
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !username}
                    >
                        {loading ? 'Processing...' : 'Submit'}
                    </button>

                    <Link to="/test/extract-unknowfield/vulnerable" className="back-button">
                        Back to Login
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;