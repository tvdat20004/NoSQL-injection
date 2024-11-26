// UserDashboardCase3.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const UserDashboardCase3 = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:8800/api/usersCase3/lookup?username=${username}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserInfo((prev) => ({
            ...prev,
            email: data.email,
          }));
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details");
      }
    };

    const username = sessionStorage.getItem("username");
    if (username) {
      setUserInfo((prev) => ({ ...prev, username }));
      fetchUserDetails(username);
    } else {
      setError("User information not found. Please log in again.");
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8800/api/usersCase3/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        sessionStorage.removeItem("username");
        navigate("/test/exfiltratingData/vulnerable", { replace: true });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>User Dashboard</h1>
        <div className="welcome-message">
          <h2>Welcome, {userInfo.username}!</h2>
          <p>You are logged in with user privileges</p>
          <div className="user-info">
            <p>Username: {userInfo.username}</p>
            <p>Email: {userInfo.email || "Loading..."}</p>
            <p>Your session is secured with HttpOnly cookies</p>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardCase3;
