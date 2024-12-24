import React, { createContext, useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (token) {
            setUser({ token, isAdmin });
        }
        setLoading(false);
    }, []);

    const login = (token, isAdmin) => {
        localStorage.setItem('token', token);
        localStorage.setItem('isAdmin', isAdmin);
        setUser({ token, isAdmin });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

export const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    return (user && user.isAdmin) ? children : <Navigate to="/posts" />;
};

export default AuthContext;