import React, { useState, useEffect } from 'react';
import { supabase } from '../../client';
import './createpost.css';

export default function CreatePost() {
  const [post, setPost] = useState({
    title: '',
    authorr: '',
    description: '',
    tags: []
  });
  const [availableTags, setAvailableTags] = useState([
    "Design", "Research", "Health", "Spiritual", "Career Focused", "Education/School", "Finance", "Creativity"
  ]);
  const [image, setImage] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const fullName = user.user_metadata?.full_name || '';
        const initials = fullName
          .split(' ')
          .map((part, index) => (index === 0 ? part : part[0]))
          .join(' ');
        setPost(prev => ({ ...prev, authorr: initials }));
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleTag = (tag) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('blog-images') // your storage bucket name
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload failed:', uploadError.message);
    setAuthError('Image upload failed');
    return;
  }

  const { data: publicURLData } = supabase
    .storage
    .from('blog-images')
    .getPublicUrl(filePath);

  setImage(publicURLData.publicUrl);
};

  const validateForm = () => {
    const newErrors = {};
    if (!post.title.trim()) newErrors.title = true;
    if (!post.authorr.trim()) newErrors.author = true;
    if (!post.description.trim()) newErrors.description = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const createPost = async (e) => {
  e.preventDefault();
  setAuthError('');
  setSuccessMessage('');

  if (!user) {
    setAuthError('To publish this you must sign in');
    return;
  }

  if (!validateForm()) return;

  try {
    const { error } = await supabase
      .from('Blog')
      .insert([{
        title: post.title,
        authorr: post.authorr,
        description: post.description,
        tag: post.tags,
        image: image || '',
        time: new Date().toISOString(),
          user_id: user.id 
      }]);
    if (error) throw error;

    setSuccessMessage('Post created successfully!');
    setTimeout(() => window.location = "/blog", 1500);
  } catch (error) {
    console.error('Error creating post:', error.message);
    setAuthError('Something went wrong. Please try again.');
  }
};

  return (
    <div className="container">
      <h2>Create a New Post</h2>
      <form onSubmit={createPost}>
        <div className="tags-box">
          <label className="form-label">Tags</label>
          <div className="tags">
            {availableTags.map((tag, i) => (
              <button
                key={i}
                type="button"
                className={`tag ${post.tags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Blog Photo</label>
          <div className="photo-box">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Preview" className="image-preview" />}
          </div>
        </div>

        <label className="form-label">Title Heading</label>
        <input
          type="text"
          name="title"
          className="text-input"
          onChange={handleChange}
          required
        />

        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="textarea-input"
          placeholder="Type here what you really want to say"
          onChange={handleChange}
          required
        />

        <div className="button-row">
          <button type="button" className="button" onClick={() => setPreviewMode(true)}>Preview</button>
          <button type="submit" className="button primary">Post this Post!</button>
        </div>
      </form>

      {previewMode && (
        <div className="preview-box">
          <h2>{post.title || "No Title"}</h2>
          <h3>by {post.authorr || "Unknown"}</h3>
          {image && <img src={image} alt="Preview" className="image-preview" />}
          <div className="preview-tags">
            {post.tags.map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
          <div className="preview-description">{post.description}</div>
        </div>
      )}
      {authError && <div className="error">{authError}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </div>
  );
}