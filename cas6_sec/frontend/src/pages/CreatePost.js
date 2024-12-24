import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch('http://localhost:3000/api/posts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      console.log('Post created:', data);
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'An error occurred while creating the post');
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Description (Supports Template Syntax)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter post description"
            required
            className="form-control"
            rows="5"
          />
        </div>
        <div className="form-group">
          <label>File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-control-file"
          />
        </div>
        <button type="submit" className="btn">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;