import React from 'react';
import { useNavigate } from 'react-router-dom';

const OperatorInjection = () => {
  const navigate = useNavigate();

  return (
    <div className="testing-panel">
      <h2>Operator Injection </h2>
      <div className="button-group">
        <button 
          onClick={() => window.open('/test/operator-injection/vulnerable', '_blank')} 
          className="normal-test-button"
        >
          Run Vulnerable Test
        </button>
        <button 
          onClick={() => window.open('/home/operator-injection/secure', '_blank')} 
          className="injection-test-button"
        >
          Run Secure Test
        </button>
      </div>
    </div>
  );
};

export default OperatorInjection;