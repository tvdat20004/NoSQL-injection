import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './pages/authContext/AuthContext';
import { useContext } from 'react';
import Home from './pages/Home/home';
import AdminDashboard from './pages/adminDashboard/adminDashboard';
import UserDashboard from './pages/sideBar/sideBar';
import Layout from './components/Layout';
import AuthBypass from './components/tests/AuthBypass';

function App() {
  const { user } = useContext(AuthContext);
  return (
    // 
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/home" />} 
        />

        {/* Admin route */}
        <Route 
          path="/admin" 
          element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
        />

        {/* User dashboard with nested routes */}
        <Route 
          path="/home" 
          element={<UserDashboard />}
        >
          <Route path="auth-bypass" element={<AuthBypass />} />
        </Route>

        {/* Root redirect */}
        <Route 
          path="/" 
          element={<Navigate to="/home" replace />} 
        />

        {/* Catch all route */}
        <Route 
          path="*" 
          element={<Navigate to="/home" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;