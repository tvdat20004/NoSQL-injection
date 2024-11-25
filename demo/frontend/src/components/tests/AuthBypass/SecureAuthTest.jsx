import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VulnerableAuthTest.css';

const SecureAuthTest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm fetch chỉ non-admin users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8800/api/security/authBypass/users/dashboard');
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError('Error fetching users: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      let searchQuery
      try {
        searchQuery = query.startsWith('{') ? JSON.parse(query) : { username: query }
      } catch {
        searchQuery = { username: query }
      }

      const response = await fetch('http://localhost:8800/api/security/authBypass/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError('Search failed')
    }
  }

  return (
    <div className="vulnerable-test-container">
      <header className="test-header">
        <h1>Users List - Secure Test</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="search-button"
          >
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

        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}

        <div className="results-container">
          <div className="results-header">
            <h2>Search Results</h2>
            <p>Total: {users.length} users found</p>
          </div>

          {users.length > 0 ? (
            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>{user.isHidden ? 'Hidden' : 'Active'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-results">
              <p>No users found matching your search criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SecureAuthTest;