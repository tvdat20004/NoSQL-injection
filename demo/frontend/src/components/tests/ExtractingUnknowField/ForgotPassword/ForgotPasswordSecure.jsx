import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPasswordSecure = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('resetToken')?.replace(/[$.]/g, '');
        const usernameFromUrl = searchParams.get('username')?.replace(/[$.]/g, '');

        if (usernameFromUrl && tokenFromUrl) {
            verifyResetToken(usernameFromUrl, tokenFromUrl);
        }
    }, [location]);

    const verifyResetToken = async (username, token) => {
        try {
            const response = await fetch('http://localhost:8800/api/secure/case4/verify-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: username.replace(/[$.]/g, ''), 
                    resetToken: token.replace(/[$.]/g, '') 
                })
            });

            const data = await response.json();

            if (data.success) {
                navigate(`/test/extract-unknowfield/secure/reset-password?username=${username}&token=${token}`);
            } else {
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
            const response = await fetch('http://localhost:8800/api/secure/case4/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: username.replace(/[$.]/g, '') 
                })
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
                <h2>Reset Password (Secure)</h2>
                {error && <div className="error-message">{error}</div>}
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
                    <Link to="/test/extract-unknowfield/secure" className="back-button">
                        Back to Login
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordSecure;