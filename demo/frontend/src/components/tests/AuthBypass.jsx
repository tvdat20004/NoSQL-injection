import React, { useState } from 'react';
import axios from 'axios';

const AuthBypass = () => {
  const [testResult, setTestResult] = useState(null);
  const [inputs, setInputs] = useState({});

  const handleTest = async (isInjection) => {
    try {
      let response;
      if (isInjection) {
        response = await axios.post('http://localhost:8800/v1/login-vulnerable-1', {
          email: { $ne: null },
          password: { $ne: null }
        });
      } else {
        response = await axios.post('http://localhost:8800/v1/login-vulnerable-1', {
          email: inputs.email,
          password: inputs.password
        });
      }
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setTestResult(JSON.stringify(err.response?.data || err.message, null, 2));
    }
  };

  return (
    <div className="testing-panel">
      <h2>Authentication Bypass Test</h2>
      <div className="button-group">
        <button onClick={() => handleTest(false)} className="normal-test-button">
          Run Vulnerable Test
        </button>
        <button onClick={() => handleTest(true)} className="injection-test-button">
          Run Secure Test
        </button>
      </div>
      {testResult && <pre className="result-display">{testResult}</pre>}
    </div>
  );
};

export default AuthBypass;