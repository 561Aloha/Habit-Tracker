import React, { useState } from 'react';
import './blog-card.css';
import { Link } from 'react-router-dom';

const BlogCard = ({ id, image, author, date, title, description, tags }) => {
  const [count, setCount] = useState(0); // state for upvote count

  const updateCount = (e) => {
    e.preventDefault(); // Prevent Link navigation when clicking the button
    setCount(prev => prev + 1);
  };

  return (
    <div className="blogpost">
      <Link to={`/post/${id}`} className="BlogCard">
        <img
          src={image || '/default.jpg'}
          alt="Post"
        />

        <div className="content">
          <div className="meta">
            {author || 'Unknown Author'} • {date || 'Unknown Date'}
          </div>

          <div className="title-row">
            <h2 className="title">{title || 'Untitled'}</h2>
            <img
              src="src/assets/arrowup.png"
              alt="Open"
              className="arrow-icon"
            />
          </div>

          <p className="preview">{description || 'No description provided.'}</p>

          <div className="tags">
            {tags?.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>

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
