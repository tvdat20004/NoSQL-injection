import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../pages/sideBar/sideBar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const testTypes = [
    { name: 'Authentication Bypass', path: '/auth-bypass' },
    { name: 'Regex Injection', path: '/regex-injection' },
    { name: 'JavaScript Injection', path: '/javascript-injection' },
    { name: 'Projection Injection', path: '/projection-injection' },
    { name: 'Aggregation Injection', path: '/aggregation-injection' },
    { name: 'Update Injection', path: '/update-injection' }
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
            className={`sidebar-button ${location.pathname === test.path ? 'active' : ''}`}
          >
            {test.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;