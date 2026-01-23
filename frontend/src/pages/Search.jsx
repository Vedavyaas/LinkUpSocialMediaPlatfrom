import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profileService from '../services/profile.service';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setHasSearched(true);
        try {
            // Service method calls /api/PROFILESERVICE/get/user/username?username=...
            // Note: Current backend returns a List<UserEntity> for "findByUsername" which is fuzzy search in repo "findByUsernameContaining"
            const data = await profileService.getUserByUsername(query);
            setResults(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error("Search failed", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Find People</h1>

            <form onSubmit={handleSearch} className="search-bar-container glass-panel">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by username..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="macos-btn" disabled={isLoading}>
                    Search
                </button>
            </form>

            <div className="search-results">
                {isLoading && <div className="loading-state">Searching...</div>}

                {!isLoading && hasSearched && results.length === 0 && (
                    <div className="empty-state">No users found.</div>
                )}

                <div className="users-grid">
                    {results.map((user) => {
                        const userId = user.id || user.Id;
                        console.log("Search Result User:", user, "ID:", userId);
                        return (
                            <Link to={`/profile/${userId}`} key={userId} className="user-card glass-panel">
                                <div className="user-avatar-small">
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-info">
                                    <div className="user-name">{user.username}</div>
                                    <div className="user-action">View Profile</div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default Search;
