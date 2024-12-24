import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [fileType, setFileType] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    fileUrl,
                    fileType,
                }),
            });
            if (res.ok) {
                navigate('/posts');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="create-post-container">
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>File URL</label>
                    <input
                        type="text"
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>File Type</label>
                    <input
                        type="text"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn">Create Post</button>
            </form>
        </div>
    );
}

export default CreatePost;