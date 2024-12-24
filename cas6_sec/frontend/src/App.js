import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import { PrivateRoute, AdminRoute } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/posts" element={
                <PrivateRoute>
                  <Posts />
                </PrivateRoute>
              } />
              <Route path="/create-post" element={
                <AdminRoute>  {/* Thay đổi ở đây */}
                  <CreatePost />
                </AdminRoute>
              } />
              <Route path="/" element={<Navigate to="/posts" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;