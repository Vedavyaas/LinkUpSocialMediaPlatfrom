import api from './api';

const authService = {
    login: async (username, password) => {
        // Gateway routes to AuthService via /AUTHSERVICE/ (Case sensitive by default in Eureka/Gateway)
        const response = await api.post('/AUTHSERVICE/authenticate', { username, password });
        console.log('Login Response:', response); // Debugging
        console.log('Response Data:', response.data); // Debugging
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Store minimal user info since backend response is just token usually (based on controller return type)
            localStorage.setItem('user', JSON.stringify({ username }));
        }
        return response.data;
    },

    register: async (userData) => {
        // Backend expects LoginRequest(username, password) for creation too based on controller
        const response = await api.post('/AUTHSERVICE/create/account', {
            username: userData.username,
            password: userData.password
        });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default authService;
