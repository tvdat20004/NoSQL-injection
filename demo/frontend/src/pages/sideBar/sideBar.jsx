// UserDashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './sideBar.css';
import { Outlet } from 'react-router-dom';

const Sidebar = ({ activeTest, setActiveTest }) => {
  const navigate = useNavigate();
  
  const testTypes = [
    { name: 'Authentication Bypass', path: 'auth-bypass' },
    { name: 'Operator Injection', path: 'operator-injection' },
    { name: 'JavaScript Injection', path: 'javascript-injection' },
    { name: 'Projection Injection', path: 'projection-injection' },
    { name: 'Aggregation Injection', path: 'aggregation-injection' },
    { name: 'Update Injection', path: 'update-injection' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>NoSQL Tests</h2>
      </div>
      <nav className="sidebar-nav">
        {testTypes.map(test => (
          <button
            key={test.path}
            onClick={() => navigate(test.path)}
            className="sidebar-button"
          >
            {test.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

// const TestingPanel = ({ activeTest }) => {
//   const [testResult, setTestResult] = useState(null);
//   const [inputs, setInputs] = useState({});

//   const handleTest = async (type) => {
//     try {
//       let response;
//       switch(type) {
//         case 'Authentication Bypass':
//           response = await axios.post('http://localhost:8800/v1/login-vulnerable-1', {
//             email: { $ne: null },
//             password: { $ne: null }
//           });
//           break;
//         case 'Regex Injection':
//           response = await axios.get(`http://localhost:8800/v1/search-vulnerable?username=^(.*?)*$`);
//           break;
//         // Add other test cases as needed
//       }
//       setTestResult(JSON.stringify(response.data, null, 2));
//     } catch (err) {
//       setTestResult(JSON.stringify(err.response?.data || err.message, null, 2));
//     }
//   };

//   return (
//     <div className="testing-panel">
//       <h2>{activeTest}</h2>
//       <input
//         type="text"
//         placeholder="Test input"
//         className="input-field"
//         onChange={(e) => setInputs({ ...inputs, main: e.target.value })}
//       />
//       <div className="button-group">
//         <button onClick={() => handleTest(activeTest)} className="normal-test-button">
//           Run Normal Test
//         </button>
//         <button onClick={() => handleTest(activeTest)} className="injection-test-button">
//           Run Injection Test
//         </button>
//       </div>
//       {testResult && <pre className="result-display">{testResult}</pre>}
//     </div>
//   );
// };

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <nav className="navbar">
          <h1>NoSQL Injection Testing</h1>
        </nav>
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;
