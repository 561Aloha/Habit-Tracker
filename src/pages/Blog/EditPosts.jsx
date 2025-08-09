import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../client';
import './createpost.css';

export default function EditPosts({ data }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: '', authorr: '', description: '', tag: [], image: '' });
  const [availableTags, setAvailableTags] = useState([
    "Design", "Research", "Health", "Spiritual", "Career Focused", "Education/School", "Finance", "Creativity"
  ]);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) return navigate('/unauthorized');

      const { data: postData, error } = await supabase.from('Blog').select().eq('id', id).single();
      if (error) return console.error('Error fetching post:', error);
      if (postData.user_id !== user.id) {
        alert('Unauthorized');
        return navigate('/unauthorized');
      }
      setPost(postData);
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag) => {
    setPost(prev => ({
      ...prev,
      tag: prev.tag.includes(tag)
        ? prev.tag.filter(t => t !== tag)
        : [...prev.tag, tag]
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
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

    setPost(prev => ({ ...prev, image: publicURLData.publicUrl }));
  };

  const updatePost = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('Blog')
      .update({
        title: post.title,
        authorr: post.authorr,
        description: post.description,
        tag: post.tag,
        image: post.image
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      setAuthError('Failed to update post.');
      return;
    }

    setSuccessMessage('Post updated successfully!');
    setTimeout(() => navigate('/blog'), 1500);
  };

  return (
    <div className="container">
      <h2>Edit Your Post</h2>
      <form onSubmit={updatePost}>
        <div className="tags-box">
          <label className="form-label">Tags</label>
          <div className="tags">
            {availableTags.map((tag, i) => (
              <button
                key={i}
                type="button"
                className={`tag ${post.tag.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Blog Photo</label>
          <input
            type="text"
            name="image"
            className="text-input"
            placeholder="Paste image URL or upload a file"
            value={post.image}
            onChange={handleChange}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {post.image && <img src={post.image} alt="Preview" className="image-preview" />}
        </div>

        <label className="form-label">Title Heading</label>
        <input
          type="text"
          name="title"
          className="text-input"
          value={post.title}
          onChange={handleChange}
          required
        />

        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="textarea-input"
          value={post.description}
          onChange={handleChange}
          required
        />

        <div className="button-row">
          <button type="submit" className="button primary">Update Post!</button>
        </div>
      </form>
      {authError && <div className="error auth-error">{authError}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </div>
  );
}
