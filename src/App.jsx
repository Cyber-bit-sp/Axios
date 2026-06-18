import React, { useState } from 'react';
import useFetch from './hooks/useFetch';
import api from './api/axiosConfig';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  
  // Fetch posts
  const { data: fetchedPosts, loading, error } = useFetch('/posts?_limit=10');

  // Update posts when data loads
  React.useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts);
    }
  }, [fetchedPosts]);

  // ✅ CREATE - Add new post
  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!newPost.title.trim() || !newPost.body.trim()) {
      alert('Please fill in both title and body');
      return;
    }

    try {
      const response = await api.post('/posts', {
        ...newPost,
        userId: 1,
      });
      
      // Add new post to the list
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', body: '' });
      console.log('✅ Post created!', response.data);
    } catch (err) {
      alert('Failed to create post');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">📥 Loading posts...</div>;
  if (error) return <div className="error">❌ Error: {error}</div>;

  return (
    <div className="app">
      <h1>📝 React + Axios - Step 2: Create Posts</h1>
      
      {/* ✅ CREATE FORM */}
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

      {/* DISPLAY POSTS */}
      <div className="posts-container">
        <h2>Posts ({posts.length})</h2>
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;