import React from 'react';

const TimingAttack = () => {

  return (
    <div className="testing-panel">
      <h2>Timing Attack</h2>
      <div className="button-group">
        <button 
          onClick={() => window.open('/test/timing-attack/vulnerable', '_blank')} 
          className="normal-test-button"
        >
          Run Vulnerable Test
        </button>
        <button 
          onClick={() => window.open('/test/timing-attack/secure', '_blank')} 
          className="injection-test-button"
        >
          Run Secure Test
        </button>
      </div>
    </div>
  );
};

export default TimingAttack;