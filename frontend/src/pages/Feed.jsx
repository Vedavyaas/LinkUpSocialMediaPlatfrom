import React, { useState, useEffect } from 'react';

import Post from '../components/Post/Post';
import Card from '../components/Card/Card';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import './Feed.css';

const Feed = () => {
    // Mock Data
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: { username: 'Vedavyaas' },
            content: 'Just launched the new frontend for LinkUp! 🚀',
            likes: 42,
            comments: 5,
            timestamp: '2 hours ago'
        },
        {
            id: 2,
            user: { username: 'Jane Doe' },
            content: 'Loving the dark mode on this app. The colors are so vibrant! ✨',
            likes: 12,
            comments: 2,
            timestamp: '4 hours ago'
        }
    ]);

    return (
        <div className="feed-container">
            <section className="create-post-section">
                <Card>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div className="avatar">M</div>
                        <div style={{ width: '100%' }}>
                            <Input
                                placeholder="What's on your mind?"
                                style={{ marginBottom: '1rem' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button size="sm">Post</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            <h1 className="feed-title">Latest Updates</h1>

            <div className="posts-list">
                {posts.map(post => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Feed;
