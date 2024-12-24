import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordRedirectSecure = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        // Sanitize token input
        const token = params.get('token')?.replace(/[$.]/g, '');
        
        if (token) {
            navigate(`/test/extract-unknowfield/secure/reset-password?token=${token}`);
        } else {
            navigate('/test/extract-unknowfield/secure/forgot-password');
        }
    }, [navigate]);

    return (
        <div className="redirect-message">
            Redirecting...
        </div>
    );
};

export default ResetPasswordRedirectSecure;