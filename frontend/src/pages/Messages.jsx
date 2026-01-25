import React, { useState, useEffect } from 'react';
import profileService from '../services/profile.service';
import ChatWindow from '../components/Chat/ChatWindow';
import authService from '../services/auth';
import ErrorBoundary from '../components/ErrorBoundary';
import './Search.css'; // Reusing search styles for user list

const Messages = () => {
    // We'll show a list of followers/following to chat with
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // Load both lists to find everyone we are connected with
            const [following, followers] = await Promise.all([
                profileService.getFollowing(),
                profileService.getFollowers()
            ]);

            const connectedUsersMap = new Map();

            if (Array.isArray(following)) {
                following.forEach(u => connectedUsersMap.set(u.username, u));
            }
            if (Array.isArray(followers)) {
                followers.forEach(u => connectedUsersMap.set(u.username, u));
            }

            const connectedUsers = Array.from(connectedUsersMap.values());
            setUsers(connectedUsers);

        } catch (error) {
            console.error("Failed to load users for messaging", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Messages</h1>

            {/* If a user is selected, show the chat window */}
            {selectedUser && (
                <ErrorBoundary>
                    <ChatWindow
                        toUser={selectedUser.username}
                        currentUser={currentUser}
                        onClose={() => setSelectedUser(null)}
                    />
                </ErrorBoundary>
            )}

            <div className="glass-panel" style={{ padding: '20px' }}>
                <h3>Start a Conversation</h3>
                <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                    Pick a user to chat with:
                </p>

                {isLoading ? (
                    <div>Loading users...</div>
                ) : (
                    <ul className="user-list">
                        {users.length === 0 && <li>No users found. Follow someone to chat!</li>}
                        {users.map(user => (
                            <li key={user.id || user.Id} className="user-list-item">
                                <div className="user-info">
                                    <div className="user-avatar-small">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="user-name">{user.username}</span>
                                </div>
                                <button
                                    className="macos-btn"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    Chat
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Messages;
