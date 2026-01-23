import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const PrivateRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    // In a real app, you might check token validity with backend here
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
