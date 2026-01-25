import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import profileService from '../../services/profile.service';
import authService from '../../services/auth';
import './Profile.css';
import ChatWindow from '../../components/Chat/ChatWindow';

const Profile = () => {
    const { id } = useParams(); // Should be optional, if empty show 'my' profile
    const [profile, setProfile] = useState(null);

    const [stats, setStats] = useState({ followers: 0, following: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [error, setError] = useState('');
    const [showChat, setShowChat] = useState(false);

    // List Modal State
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [modalList, setModalList] = useState([]);
    const [isListLoading, setIsListLoading] = useState(false);

    // Friend Status (for follow button toggle)
    const [isFollowing, setIsFollowing] = useState(false);
    const [canMessage, setCanMessage] = useState(false);

    // Determine if we are viewing our own profile
    const currentUser = authService.getCurrentUser();
    const isOwnProfile = !id || (profile && currentUser && profile.username === currentUser.username);

    useEffect(() => {
        fetchProfileData();
    }, [id]);

    const fetchProfileData = async () => {
        setIsLoading(true);
        setError('');
        try {
            let profileData;

            if (id) {
                // Fetch by ID
                profileData = await profileService.getUserById(id);
            } else {
                // Fetch My Profile
                if (!currentUser) throw new Error("Not logged in");
                // Try direct endpoint first if available, otherwise search
                try {
                    // Since getProfile is soft fallback, let's try search logic explicitly if we know endpoint is missing
                    // or just use the search logic as primary for now based on service code
                    const users = await profileService.getUserByUsername(currentUser.username);
                    // Ensure users is an array
                    if (Array.isArray(users)) {
                        profileData = users.find(u => u.username === currentUser.username) || users[0];
                    } else if (users && users.username) {
                        // Maybe it returned a single user object?
                        profileData = users;
                    }
                } catch (innerErr) {
                    console.error("Search by username failed", innerErr);
                }
            }

            if (!profileData) throw new Error("Profile not found");

            setProfile(profileData);
            setNewUsername(profileData.username);

            // Fetch stats logic
            const statsTargetId = id ? (profileData.id || profileData.Id) : null;
            // Only fetch stats if we have a valid ID or if it's "me" and backend handles it
            // Adjust depending on API capabilities. Assuming API needs ID for stats.
            const targetIdForStats = statsTargetId || profileData.id || profileData.Id;

            if (targetIdForStats) {
                try {
                    const followersCount = await profileService.getFollowersCount(targetIdForStats);
                    const followingCount = await profileService.getFollowingCount(targetIdForStats);
                    setStats({ followers: followersCount || 0, following: followingCount || 0 });

                    // Determine if I am following this user
                    if (!isOwnProfile && currentUser) {
                        const myFollowing = await profileService.getFollowing();
                        const isFound = Array.isArray(myFollowing) && myFollowing.some(u => (u.username === profileData.username));
                        setIsFollowing(isFound);
                    }
                } catch (e) {
                    console.error("Failed to load stats", e);
                }
            }

        } catch (err) {
            console.error("Failed to fetch profile", err);
            setError("Could not load profile. " + (err.message || ''));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await profileService.updateUsername(newUsername);
            setProfile(prev => ({ ...prev, username: newUsername }));
            setIsEditing(false);
            localStorage.setItem('user', JSON.stringify({ username: newUsername }));
        } catch (err) {
            console.error("Update failed", err);
            setError("Failed to update username.");
        }
    };

    const handleFollow = async () => {
        if (!profile) return;
        const targetId = profile.id || profile.Id;
        try {
            const result = await profileService.followUser(targetId);
            alert(result || "Request sent");
            setIsFollowing(true); // Optimistic update
            fetchProfileData(); // Refresh stats
        } catch (err) {
            console.error("Follow failed", err);
            let msg = err.response?.data?.message || err.response?.data || "Failed to follow user";
            if (typeof msg === 'object') msg = JSON.stringify(msg);
            alert("Failed: " + msg);
        }
    };

    const handleUnfollow = async () => {
        if (!profile) return;
        if (!window.confirm("Are you sure you want to unfollow?")) return;

        const targetId = profile.id || profile.Id;
        try {
            await profileService.unfollowUser(targetId);
            alert("Unfollowed");
            setIsFollowing(false);
            fetchProfileData();
        } catch (err) {
            console.error("Unfollow failed", err);
            alert("Failed to unfollow");
        }
    };

    const openFollowersModal = async () => {
        setShowFollowersModal(true);
        setIsListLoading(true);
        try {
            // Pass ID if viewing other, else null for self
            const targetId = isOwnProfile ? null : (profile.id || profile.Id);
            const list = await profileService.getFollowers(targetId);
            setModalList(list);
        } catch (e) {
            console.error("Failed to load followers", e);
        } finally {
            setIsListLoading(false);
        }
    };

    const openFollowingModal = async () => {
        setShowFollowingModal(true);
        setIsListLoading(true);
        try {
            const targetId = isOwnProfile ? null : (profile.id || profile.Id);
            const list = await profileService.getFollowing(targetId);
            setModalList(list);
        } catch (e) {
            console.error("Failed to load following", e);
        } finally {
            setIsListLoading(false);
        }
    };

    const closeModals = () => {
        setShowFollowersModal(false);
        setShowFollowingModal(false);
        setModalList([]);
    };

    // Remove a follower (Only allowed if viewing OWN profile, and looking at Followers list)
    const handleRemoveFollower = async (listUserId) => {
        if (!window.confirm("Remove this follower?")) return;
        try {
            await profileService.deleteFollower(listUserId);
            // Remove from local list
            setModalList(prev => prev.filter(u => (u.id || u.Id) !== listUserId));
            // Update stats
            setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
        } catch (e) {
            console.error("Failed to remove follower", e);
            alert("Failed to remove follower");
        }
    };

    // Unfollow from list (Only allowed if viewing OWN profile, and looking at Following list)
    const handleUnfollowFromList = async (listUserId) => {
        if (!window.confirm("Unfollow this user?")) return;
        try {
            await profileService.unfollowUser(listUserId);
            setModalList(prev => prev.filter(u => (u.id || u.Id) !== listUserId));
            setStats(prev => ({ ...prev, following: prev.following - 1 }));
        } catch (e) {
            console.error("Failed to unfollow", e);
            alert("Failed to unfollow");
        }
    };


    if (isLoading) return <div className="loading-state">Loading profile...</div>;
    if (!profile) return <div className="error-state">Profile not found. {error} (ID: {id || 'me'})</div>;

    return (
        <div className="page-container">
            {/* Chat Window Integration */}
            {showChat && (
                <ChatWindow
                    toUser={profile.username}
                    currentUser={currentUser}
                    onClose={() => setShowChat(false)}
                />
            )}

            <div className="profile-header glass-panel">
                <div className="profile-cover"></div>
                <div className="profile-content">
                    <div className="profile-avatar-large">
                        {profile.username?.charAt(0).toUpperCase()}
                    </div>

                    <div className="profile-details">
                        <div className="profile-name-row">
                            <h1 className="profile-name">{profile.username}</h1>
                            {isOwnProfile && (
                                <button className="macos-btn-ghost" onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </button>
                            )}
                            {!isOwnProfile && (
                                <div className="profile-actions">
                                    <button
                                        className="macos-btn-ghost"
                                        onClick={() => setShowChat(!showChat)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        Message
                                    </button>
                                    {isFollowing ? (
                                        <button className="macos-btn-danger" onClick={handleUnfollow}>
                                            Unfollow
                                        </button>
                                    ) : (
                                        <button className="macos-btn" onClick={handleFollow}>
                                            Follow
                                        </button>
                                    )}

                                </div>
                            )}
                        </div>

                        <div className="profile-stats-row">
                            <div className="stat-pill clickable" onClick={openFollowersModal}>
                                <span className="stat-num">{stats.followers}</span> Followers
                            </div>
                            <div className="stat-pill clickable" onClick={openFollowingModal}>
                                <span className="stat-num">{stats.following}</span> Following
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal Overlay */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-card glass-panel">
                        <h3>Edit Profile</h3>
                        <form onSubmit={handleUpdateProfile} className="edit-form">
                            <input
                                type="text"
                                className="macos-input"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                            <div className="modal-actions">
                                <button type="button" className="macos-btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="macos-btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lists Modal */}
            {(showFollowersModal || showFollowingModal) && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-card glass-panel list-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{showFollowersModal ? 'Followers' : 'Following'}</h3>
                            <button className="close-btn" onClick={closeModals}>×</button>
                        </div>
                        <div className="modal-list-content">
                            {isListLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <ul className="user-list">
                                    {modalList.length === 0 && <li className="empty-list">No users found.</li>}
                                    {modalList.map(user => (
                                        <li key={user.id || user.Id} className="user-list-item">
                                            <div className="user-info">
                                                <div className="user-avatar-small">
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="user-name">{user.username}</span>
                                            </div>
                                            {isOwnProfile && (
                                                <div className="list-actions">
                                                    {showFollowersModal && (
                                                        <button
                                                            className="macos-btn-ghost-danger small-btn"
                                                            onClick={() => handleRemoveFollower(user.id || user.Id)}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                    {showFollowingModal && (
                                                        <button
                                                            className="macos-btn-ghost-danger small-btn"
                                                            onClick={() => handleUnfollowFromList(user.id || user.Id)}
                                                        >
                                                            Unfollow
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
