import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.login(formData.username, formData.password);
            navigate('/'); // Redirect to dashboard
        } catch (err) {
            console.error('Login failed', err);
            setError('Invalid credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="auth-glass-card glass-panel">
                <div className="auth-header">
                    <h2 className="auth-title">Sign In</h2>
                    <p className="auth-subtitle">Welcome back to LinkUp</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

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
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="macos-btn full-width" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <span>•</span>
                    <Link to="/register">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
