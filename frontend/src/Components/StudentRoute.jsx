import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentRoute = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (user.role !== 'student') {
        
        return <Navigate to="/teacher/dashboard" />;
    }

    return <Outlet />;
};

export default StudentRoute;
