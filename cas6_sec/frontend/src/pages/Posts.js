import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Posts() {
    const [posts, setPosts] = useState([]);
    const { user } = useAuth();

    const fetchPosts = useCallback(async () => {
        if (!user?.token) return;
        
        try {
            const res = await fetch('http://localhost:3000/api/posts', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await res.json();
            // Đảm bảo data.posts là một array
            setPosts(data.posts || []); // Thay đổi ở đây
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [user?.token]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleComment = async (postId, commentText) => {
        try {
            const res = await fetch(`http://localhost:3000/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ text: commentText }),
            });
            if (res.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="posts-container">
            <h2>Posts</h2>
            {Array.isArray(posts) && posts.map((post) => (
                <div key={post._id} className="post-card">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-description">{post.description}</p>
                    {post.fileUrl && (
                        <div className="post-file">
                            <a href={post.fileUrl} target="_blank" rel="noopener noreferrer">
                                View File
                            </a>
                        </div>
                    )}
                    <div className="comments-section">
                        <h4>Comments</h4>
                        {post.comments && post.comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <p>{comment.text}</p>
                                <small>By: {comment.user?.username || 'Anonymous'}</small>
                            </div>
                        ))}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const commentText = e.target.comment.value;
                                if (commentText.trim()) {
                                    handleComment(post._id, commentText);
                                    e.target.comment.value = '';
                                }
                            }}
                            className="comment-form"
                        >
                            <input
                                name="comment"
                                type="text"
                                className="comment-input"
                                placeholder="Add a comment..."
                            />
                            <button type="submit" className="btn">Comment</button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Posts;