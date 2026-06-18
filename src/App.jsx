import React, { useState } from 'react';
import useFetch from './hooks/useFetch';
import api from './api/axiosConfig';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editingPost, setEditingPost] = useState(null); // 👈 New state for editing
  
  // Fetch posts
  const { data: fetchedPosts, loading, error } = useFetch('/posts?_limit=10');

  // Update posts when data loads
  React.useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts);
    }
  }, [fetchedPosts]);

  // CREATE - Add new post
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.body.trim()) {
      alert('Please fill in both title and body');
      return;
    }

    try {
      const response = await api.post('/posts', {
        ...newPost,
        userId: 1,
      });
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', body: '' });
      console.log('✅ Post created!');
    } catch (err) {
      alert('Failed to create post');
      console.error(err);
    }
  };

  // ✏️ UPDATE - Edit existing post
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      const response = await api.put(`/posts/${editingPost.id}`, editingPost);
      setPosts(posts.map(post => 
        post.id === editingPost.id ? response.data : post
      ));
      setEditingPost(null);
      console.log('✅ Post updated!');
    } catch (err) {
      alert('Failed to update post');
      console.error(err);
    }
  };

  // Start editing - set the post to edit
  const startEditing = (post) => {
    setEditingPost({ ...post }); // Create a copy
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPost(null);
  };

  if (loading) return <div className="loading">📥 Loading posts...</div>;
  if (error) return <div className="error">❌ Error: {error}</div>;

  return (
    <div className="app">
      <h1>📝 React + Axios - Step 3: Update Posts</h1>
      
      {/* CREATE FORM */}
      <div className="create-form">
        <h2>Create New Post</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Post title..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Post content..."
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            required
          />
          <button type="submit">➕ Create Post</button>
        </form>
      </div>

      {/* ✏️ EDIT FORM - Shows when editing */}
      {editingPost && (
        <div className="edit-form">
          <h2>✏️ Edit Post</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={editingPost.title}
              onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
              required
            />
            <textarea
              value={editingPost.body}
              onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
              required
            />
            <div className="edit-actions">
              <button type="submit">💾 Update Post</button>
              <button type="button" onClick={cancelEditing}>❌ Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* DISPLAY POSTS */}
      <div className="posts-container">
        <h2>Posts ({posts.length})</h2>
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <div className="post-actions">
              <button 
                className="edit-btn" 
                onClick={() => startEditing(post)}
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;