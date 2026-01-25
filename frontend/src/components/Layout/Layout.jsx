import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import './Layout.css';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <h1 className="app-logo">LinkUp</h1>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/messages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">💬</span>
                        <span className="nav-label">Messages</span>
                    </NavLink>

                    <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">👤</span>
                        <span className="nav-label">Profile</span>
                    </NavLink>

                    <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">🔍</span>
                        <span className="nav-label">Search</span>
                    </NavLink>

                    <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">🔔</span>
                        <span className="nav-label">Notifications</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="nav-item logout-btn">
                        <span className="nav-icon">🚪</span>
                        <span className="nav-label">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
