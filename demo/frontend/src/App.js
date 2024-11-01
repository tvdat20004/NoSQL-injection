import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './pages/authContext/AuthContext';
import { useContext } from 'react';
import AdminDashboard from './pages/adminDashboard/adminDashboard';
import UserDashboard from './pages/sideBar/sideBar';
import AuthBypass from './components/tests/AuthBypass/AuthBypass';
import VulnerableAuthTest from './components/tests/AuthBypass/VulnerableAuthTest';

//case 2
import OperatorInjection from './components/tests/OperatorInjection/OperatorInjection';
import LoginForm from './components/tests/OperatorInjection/LoginForm';
import { ROUTES } from './components/tests/OperatorInjection/config/routes';
import AdminDashboardCase2 from './components/tests/OperatorInjection/AdminDashboard';
import UserDashboardCase2 from './components/tests/OperatorInjection/UserDashboard';

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
          <Route path="operator-injection" element={<OperatorInjection />} />
        </Route>

        <Route 
          path="/test/auth-bypass/vulnerable" 
          element={<VulnerableAuthTest />} 
        />

      <Route path={ROUTES.LOGIN} element={<LoginForm />} />
      <Route path={ROUTES.ADMIN} element={<AdminDashboardCase2 />} />
      <Route path={ROUTES.USER} element={<UserDashboardCase2 />} />





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