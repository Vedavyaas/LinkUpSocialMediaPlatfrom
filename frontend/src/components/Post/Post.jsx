import React from 'react';
import Card from '../Card/Card';
import './Post.css';

const Post = ({ post }) => {
    return (
        <Card className="post-card">
            <div className="post-header">
                <div className="avatar">
                    {post.user.username[0].toUpperCase()}
                </div>
                <div className="post-user-info">
                    <h3>{post.user.username}</h3>
                    <span>{post.timestamp}</span>
                </div>
            </div>

            <div className="post-content">
                <p>{post.content}</p>

                {post.imageUrl && (
                    <img src={post.imageUrl} alt="Post content" className="post-image" />
                )}
            </div>

            <div className="post-actions">
                <button className="action-btn">
                    ❤️ {post.likes} Likes
                </button>
                <button className="action-btn">
                    💬 {post.comments} Comments
                </button>
            </div>
        </Card>
    );
};

export default Post;
