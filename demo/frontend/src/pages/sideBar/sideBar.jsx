// UserDashboard.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./sideBar.css";
import { Outlet } from "react-router-dom";

const Sidebar = ({ activeTest, setActiveTest }) => {
  const navigate = useNavigate();

  const testTypes = [
    { name: "Authentication Bypass", path: "auth-bypass" },
    { name: "Operator Injection", path: "operator-injection" },
    { name: "Exfiltrating data in MongoDB", path: "exfiltratingData" },
    { name: "Projection Injection", path: "projection-injection" },
    { name: "Aggregation Injection", path: "aggregation-injection" },
    { name: "Update Injection", path: "update-injection" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>NoSQL Tests</h2>
      </div>
      <nav className="sidebar-nav">
        {testTypes.map((test) => (
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
