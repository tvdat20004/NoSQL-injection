import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthBypass = () => {
  const navigate = useNavigate();

  return (
    <div className="testing-panel">
      <h2>Authentication Bypass Test</h2>
      <div className="button-group">
        <button 
          onClick={() => window.open('/test/auth-bypass/vulnerable', '_blank')} 
          className="normal-test-button"
        >
          Run Vulnerable Test
        </button>
        <button 
          onClick={() => window.open('/home/auth-bypass/secure', '_blank')} 
          className="injection-test-button"
        >
          Run Secure Test
        </button>
      </div>
    </div>
  );
};

export default AuthBypass;