import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            if (loggedInUser) {
                setUser(loggedInUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
           
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (userData) => {
        try {
            const response = await authService.login(userData);
            setUser(response);
            if (response.role === 'teacher') {
                navigate('/teacher/dashboard');
            } else {
                navigate('/student/dashboard');
            }
            return response;
        } catch (error) {
           
            throw error;
        }
    };

    const logout = () => {
        
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };

    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

