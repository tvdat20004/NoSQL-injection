import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VulnerableAuthTest.css";

const VulnerableAuthTest = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  // Fetch non-admin users khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm fetch chỉ non-admin users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8800/api/vulnerable/case1/users/dashboard"
      );
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(
        "Error fetching users: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      let searchQuery;
      try {
        searchQuery = query.startsWith("{")
          ? JSON.parse(query)
          : { username: query };
      } catch {
        searchQuery = { username: query };
      }

      const response = await fetch(
        "http://localhost:8800/api/vulnerable/authBypass/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
        }
      );

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Search failed");
    }
  };

  return (
    <div className="vulnerable-test-container">
      <header className="test-header">
        <h1>Users List - Vulnerable Test</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </header>

      <main className="test-content">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        )}

        <div className="results-container">
          <div className="results-header">
            <h2>Search Results</h2>
          </div>

          <div className="results-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>IsHidden</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.isHidden && <span>Hidden User</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VulnerableAuthTest;
