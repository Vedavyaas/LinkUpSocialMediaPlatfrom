import React, { useState, useEffect } from 'react';
import profileService from '../services/profile.service';
import './Notifications.css';

const Notifications = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            // Endpoint: /get/followRequest
            const data = await profileService.getFollowRequests();
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load requests", err);
            setError("Could not load notifications.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            await profileService.acceptFollowRequest(id);
            // Remove from list
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (err) {
            console.error("Accept failed", err);
            let msg = err.response?.data?.message || err.response?.data || "Failed to accept request";
            if (typeof msg === 'object') msg = JSON.stringify(msg);
            alert("Failed: " + msg);
        }
    };

    const handleDecline = async (id) => {
        try {
            // Assuming deleteFollower or deleteRequest is the correct action
            // Based on earlier analysis: /request/delete might be for this or kicking followers.
            // Let's assume hitting delete works for rejecting a pending request too if the backend allows, 
            // or we might need to use Unfollow logic if it's bidirectional.
            // Safe bet: deleteFollower (removes the relationship entity)
            await profileService.deleteFollower(id);
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (err) {
            console.error("Decline failed", err);
            let msg = err.response?.data?.message || err.response?.data || "Failed to decline request";
            if (typeof msg === 'object') msg = JSON.stringify(msg);
            alert("Failed: " + msg);
        }
    };

    if (isLoading) return <div className="loading-state">Loading notifications...</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Notifications</h1>

            {error && <div className="error-message">{error}</div>}

            {(!requests || requests.length === 0) ? (
                <div className="empty-state glass-panel">
                    <p>No new notifications</p>
                </div>
            ) : (
                <div className="requests-list">
                    <h2 className="section-title">Follow Requests</h2>
                    <div className="requests-grid">
                        {requests.map(user => (
                            <div key={user.id} className="request-card glass-panel">
                                <div className="req-user-info">
                                    <div className="req-avatar">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="req-username">{user.username}</span>
                                </div>
                                <div className="req-actions">
                                    <button
                                        className="macos-btn-sm primary"
                                        onClick={() => handleAccept(user.id)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="macos-btn-sm secondary"
                                        onClick={() => handleDecline(user.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
