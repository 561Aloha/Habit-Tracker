// src/pages/Blog/BlogCard.jsx
import React, { useState } from 'react';
import './blog-card.css';
import { Link } from 'react-router-dom';

const BlogCard = ({ id, image, author, date, title, description, tag, tags }) => {
  const [count, setCount] = useState(0);

  const updateCount = (e) => {
    e.preventDefault();
    setCount((prev) => prev + 1);
  };

  // Normalize tags: support `tags` (array) OR `tag` (string or array)
  const tagsArr = Array.isArray(tags)
    ? tags
    : Array.isArray(tag)
    ? tag
    : typeof tag === 'string' && tag.trim()
    ? [tag.trim()]
    : [];

  // Only show author/date if present
  const hasAuthor = !!(author && String(author).trim());
  const hasDate = !!(date && String(date).trim());
  const metaText = hasAuthor && hasDate ? `${author} • ${date}` : hasAuthor ? author : hasDate ? date : '';

  return (
    <div className="blogpost">
      <Link to={`/post/${id}`} className="BlogCard">
        <img src={image || '/default.jpg'} alt={title || 'Post'} />

        <div className="content">
          {metaText && <div className="meta">{metaText}</div>}
          <div className="title-row">
            <h2 className="title">{title || 'Untitled'}</h2>
            <img src="src/assets/arrowup.png" alt="Open" className="arrow-icon" />
          </div>

          {description && String(description).trim() && (
            <p className="preview">{description}</p>
          )}

          {tagsArr.length > 0 && (
            <div className="tags">
              {tagsArr.map((t, idx) => (
                <span key={`${id}-tag-${idx}`} className="tag">
                  {t}
                </span>
              ))}
            </div>
          )}
  
          <div className="upvotes">
            👍 Upvotes: {count}
            <button className="betButton" onClick={updateCount}>
              Vote 🗳️
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
