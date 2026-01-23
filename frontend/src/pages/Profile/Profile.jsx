import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import profileService from '../../services/profile.service';
import authService from '../../services/auth';
import './Profile.css';

const Profile = () => {
    const { id } = useParams(); // Should be optional, if empty show 'my' profile
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ followers: 0, following: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [error, setError] = useState('');

    // Determine if we are viewing our own profile
    const currentUser = authService.getCurrentUser();
    const isOwnProfile = !id || (profile && currentUser && profile.username === currentUser.username);

    useEffect(() => {
        fetchProfileData();
    }, [id]);

    const fetchProfileData = async () => {
        setIsLoading(true);
        try {
            let profileData;

            if (id) {
                // Fetch by ID
                profileData = await profileService.getUserById(id);
            } else {
                // Fetch My Profile
                // Since /get/myProfile is missing in backend, we fallback to finding by username
                // Backend: /get/user/username returns List<UserEntity>
                if (!currentUser) throw new Error("Not logged in");
                const users = await profileService.getUserByUsername(currentUser.username);
                // Assume first match is correct for now (exact match logic needed if fuzzy)
                profileData = users.find(u => u.username === currentUser.username) || users[0];
            }

            if (!profileData) throw new Error("Profile not found");

            setProfile(profileData);
            setNewUsername(profileData.username);

            // Fetch stats logic
            if (!id) { // Own profile
                const followersCount = await profileService.getFollowersCount();
                const followingCount = await profileService.getFollowingCount();
                setStats({ followers: followersCount, following: followingCount });
            } else {
                setStats({ followers: 0, following: 0 });
            }

        } catch (err) {
            console.error("Failed to fetch profile", err);
            setError("Could not load profile.");
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
        console.log("Following user ID:", targetId);
        try {
            const result = await profileService.followUser(targetId);
            // Result is "Wait for approval" or "Blocked" or success
            alert(result || "Request sent");
        } catch (err) {
            console.error("Follow failed", err);
            // Show more details if available
            let msg = err.response?.data?.message || err.response?.data || "Failed to follow user";
            if (typeof msg === 'object') msg = JSON.stringify(msg);
            alert("Failed: " + msg);
        }
    };

    if (isLoading) return <div className="loading-state">Loading profile...</div>;
    if (!profile) return <div className="error-state">Profile not found. {error} (ID: {id || 'me'})</div>;

    return (
        <div className="page-container">
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
                                <button className="macos-btn" onClick={handleFollow}>
                                    Follow
                                </button>
                            )}
                        </div>

                        <div className="profile-stats-row">
                            <div className="stat-pill">
                                <span className="stat-num">{stats.followers}</span> Followers
                            </div>
                            <div className="stat-pill">
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
        </div>
    );
};

export default Profile;
