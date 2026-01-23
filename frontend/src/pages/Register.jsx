import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.register(formData);
            // Auto login or redirect to login? Let's redirect to login for clarity
            navigate('/login');
        } catch (err) {
            console.error('Registration failed', err);
            setError('Registration failed. Username might be taken.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="auth-glass-card glass-panel">
                <div className="auth-header">
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join LinkUp today</p>
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
                    <div className="form-group">
                        <input
                            type="password"
                            className="macos-input"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="macos-btn full-width" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
