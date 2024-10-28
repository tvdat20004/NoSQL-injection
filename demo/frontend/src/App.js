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

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/login' element={
            !user ? <Login /> : <Navigate to="/" />}
        />
        <Route exact path='/' element={
          user ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user/*" element={<UserDashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;