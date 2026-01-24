import api from './api';

const profileService = {
    // --- Public/User Lookups ---

    // Get all users (except self)
    getAllUsers: async () => {
        const response = await api.get('/PROFILESERVICE/get/allUsers');
        return response.data;
    },

    // Search user by username (returns List)
    getUserByUsername: async (username) => {
        const response = await api.get(`/PROFILESERVICE/get/user/username?username=${username}`);
        return response.data;
    },

    // Get user by ID
    getUserById: async (id) => {
        const response = await api.get(`/PROFILESERVICE/get/user/id?id=${id}`);
        return response.data;
    },

    // Attempt to get my profile directly (if endpoint exists) or via workaround
    getProfile: async () => {
        // Warning: /get/myProfile might not be deployed yet. 
        // Fallback or attempt calling it:
        try {
            const response = await api.get('/PROFILESERVICE/get/myProfile');
            return response.data;
        } catch (e) {
            console.warn("Soft fallback: getMyProfile endpoint failed.", e);
            throw e;
        }
    },

    // --- My Account Management ---

    // Update username
    updateUsername: async (newUsername) => {
        const response = await api.put(`/PROFILESERVICE/update/username?newUsername=${newUsername}`);
        return response.data;
    },

    // --- Blocking ---

    blockUser: async (id) => {
        const response = await api.put(`/PROFILESERVICE/block/user?id=${id}`);
        return response.data;
    },

    unblockUser: async (id) => {
        const response = await api.put(`/PROFILESERVICE/unblock/user?id=${id}`);
        return response.data;
    },

    isBlocked: async (id) => {
        const response = await api.get(`/PROFILESERVICE/is/blocked?id=${id}`);
        return response.data;
    },

    // --- Relationship / Follow Flow ---

    // Send follow request OR follow immediately (depending on logic)
    followUser: async (id) => {
        const response = await api.put(`/PROFILESERVICE/follow/user?id=${id}`);
        return response.data;
    },

    // Unfollow a user
    unfollowUser: async (id) => {
        const response = await api.delete(`/PROFILESERVICE/request/Unfollow?id=${id}`);
        return response.data;
    },

    // --- Follow Requests ---

    // Get incoming follow requests
    getFollowRequests: async () => {
        const response = await api.get('/PROFILESERVICE/get/followRequest');
        return response.data;
    },

    // Accept a follow request
    acceptFollowRequest: async (id) => {
        const response = await api.put(`/PROFILESERVICE/accept/followRequest?id=${id}`);
        return response.data;
    },

    // Decline/Delete a follower? (Warning: Backend URL says /request/delete, likely deleting a follower or request)
    deleteFollower: async (id) => {
        const response = await api.delete(`/PROFILESERVICE/request/delete?id=${id}`);
        return response.data;
    },

    // --- Lists and Counts ---

    // Get my followers
    getFollowers: async () => {
        const response = await api.get('/PROFILESERVICE/get/followers');
        return response.data;
    },

    // Get who I am following
    getFollowing: async () => {
        const response = await api.get('/PROFILESERVICE/get/following');
        return response.data;
    },

    getFollowersCount: async (id) => {
        // Use new endpoint that supports ID
        const url = id
            ? `/PROFILESERVICE/get/stats/followers?id=${id}`
            : '/PROFILESERVICE/get/stats/followers';
        const response = await api.get(url);
        return response.data;
    },

    getFollowingCount: async (id) => {
        const url = id
            ? `/PROFILESERVICE/get/stats/following?id=${id}`
            : '/PROFILESERVICE/get/stats/following';
        const response = await api.get(url);
        return response.data;
    }
};

export default profileService;
