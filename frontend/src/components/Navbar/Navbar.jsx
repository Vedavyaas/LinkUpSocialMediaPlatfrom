import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import authService from '../../services/auth';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">LinkUp</Link>

            <div className="nav-links">
                <Link to="/" className="nav-link">Feed</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
            </div>

            <div className="nav-profile">
                {user ? (
                    <>
                        <div className="avatar">{user.username ? user.username[0].toUpperCase() : 'U'}</div>
                        <Button size="sm" variant="ghost" onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <Link to="/login"><Button size="sm">Login</Button></Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
