import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="nav-links">
                    <Link to="/posts">Posts</Link>
                    {/* Chỉ hiển thị Create Post nếu là admin */}
                    {user?.isAdmin && <Link to="/create-post">Create Post</Link>}
                </div>
                {user ? (
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
}
export default Navbar;