import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Parse username và token từ URL
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get('username');
    const token = queryParams.get('token');

    useEffect(() => {
        // Kiểm tra nếu không có username hoặc token
        if (!username || !token) {
            navigate('/forgot-password');
        }
    }, [username, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8800/api/vulnerable/case4/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    token: token,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Password reset successful!');
                navigate('/test/extract-unknowfield/vulnerable');
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred while resetting password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-form">
                <h2>Set New Password</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({
                                ...formData,
                                newPassword: e.target.value
                            })}
                            required
                            className="form-input"
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({
                                ...formData,
                                confirmPassword: e.target.value
                            })}
                            required
                            className="form-input"
                            minLength="6"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;