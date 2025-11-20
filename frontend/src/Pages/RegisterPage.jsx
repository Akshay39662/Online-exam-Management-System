import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import './AuthForm.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
    });
    const [message, setMessage] = useState('');

    const { name, email, password, confirmPassword, role } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); 

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const userData = { name, email, password, role };
            await authService.register(userData);
            setMessage('Registration successful! Please proceed to login.');
        } catch (error) {
            const errorMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={onSubmit}>
                <h2>Create Your Account</h2>
                {message && <p className="auth-message">{message}</p>}
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        minLength="6"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        minLength="6"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Register as:</label>
                    <select name="role" value={role} onChange={onChange}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>
                <button type="submit" className="auth-button">Register</button>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;

