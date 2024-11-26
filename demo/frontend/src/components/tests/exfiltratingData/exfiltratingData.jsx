import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExfiltratingData = () => {
  const navigate = useNavigate();

  return (
    <div className="testing-panel">
      <h2>Exfiltrating data in MongoDB</h2>
      <div className="button-group">
        <button 
          onClick={() => window.open('/test/exfiltratingData/vulnerable', '_blank')} 
          className="normal-test-button"
        >
          Run Vulnerable Test
        </button>
        <button 
          onClick={() => window.open('/test/exfiltratingData/secure', '_blank')} 
          className="injection-test-button"
        >
          Run Secure Test
        </button>
      </div>
    </div>
  );
};

export default ExfiltratingData;