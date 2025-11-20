import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="app-header">
            <div className="header-content">
                <h1 className="app-title">Exam Platform</h1>
                {user && (
                    <div className="user-info">
                        <span>{user.name} ({user.role})</span>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
