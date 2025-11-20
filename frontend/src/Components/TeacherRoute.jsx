import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeacherRoute = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'teacher') {
        
        return <Navigate to="/student/dashboard" />;
    }

    return <Outlet />;
};

export default TeacherRoute;
