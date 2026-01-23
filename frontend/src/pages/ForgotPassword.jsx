import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import './Auth.css';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            // Using api.post to go through gateway /api proxy
            // Endpoint: /AUTHSERVICE/forget/password
            const response = await api.post('/AUTHSERVICE/forget/password', {
                username: formData.username,
                password: formData.password // In a real app this would likely be new password logic or email reset
            });
            setMessage("Password reset successfully. Redirecting to login...");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Reset failed', err);
            setError('Failed to reset password. Check username.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="auth-glass-card glass-panel">
                <div className="auth-header">
                    <h2 className="auth-title">Reset Password</h2>
                    <p className="auth-subtitle">Enter your username and new password</p>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {message && <div style={{ color: 'var(--success-color)', marginBottom: '16px' }}>{message}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <input
                            type="text"
                            className="macos-input"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="macos-input"
                            placeholder="New Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="macos-btn full-width" disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login">Back to Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
