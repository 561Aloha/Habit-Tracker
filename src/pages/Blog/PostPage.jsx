import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../client';
import '../../css/postpage.css';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = (content) => {
    if (!content) return '1 min read';
    
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    return readingTime === 1 ? '1 min read' : `${Math.min(readingTime, 5)} min read`;
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get user initials for avatar
  const getUserInitials = (userEmail) => {
    if (!userEmail) return 'U';
    return userEmail.charAt(0).toUpperCase();
  };

  // Get display name from email
  const getDisplayName = (userEmail) => {
    if (!userEmail) return 'Anonymous';
    return userEmail.split('@')[0];
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      
      const { data: postData, error: postErr } = await supabase
        .from('Blog')
        .select('*')
        .eq('id', id)
        .single();

      if (!postErr && postData) {
        setPost(postData);
      }

      const { data: commentsData } = await supabase
        .from('Comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });

      setComments(commentsData || []);

      const { data: countData } = await supabase
        .from('Blog')
        .select('betcount')
        .eq('id', id)
        .single();

      setCount(countData?.betcount ?? 0);
      setLoading(false);
    };

    fetchAll();
  }, [id]);

  const updateCount = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newCount = count + 1;
    setCount(newCount);
    await supabase.from('Blog').update({ betcount: newCount }).eq('id', id);
  };

  const commentsubmissions = async (event) => {
    event.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    const { error } = await supabase
      .from('Comments')
      .insert([{ 
        post_id: id, 
        user_id: currentUser.email || currentUser.id, 
        text: commentText.trim() 
      }]);

    if (!error) {
      // Refresh comments to get the latest with proper ordering
      const { data: updatedComments } = await supabase
        .from('Comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });
      
      setComments(updatedComments || []);
      setCommentText('');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div className="error">Post not found</div>;

  const readingTime = calculateReadingTime(post.content || post.description);

  return (
    <div className="blog-post-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">›</span>
        <Link to="/blog">Blog</Link>
        <span className="separator">›</span>
        <span className="current">Post</span>
      </nav>

      <article className="blog-post">
        {/* Header Section */}
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          
         
          <div className="post-meta">
            <div className="post-meta-left">
              <span className="post-date">{formatDate(post.time || post.created_at)}</span>
              <span className="reading-time">{readingTime}</span>
            </div>
            
            <div className="post-meta-right">

              
              <button className="share-button" onClick={handleShare}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                Share
              </button>
              
              {currentUser && (
                <Link to={`/edit/${post.id}`} className="edit-link">
                  ✏️ Edit
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Author Info */}
        <div className="author-section">
          <div className="author-avatar">
            {post.author ? post.author.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="author-info">
            <span className="author-name">{post.author || 'Anonymous'}</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="image-container">
            <img src={post.image} className="featured-image" alt={post.title} />
          </div>
        )}

        {/* Post Content */}
        <div className="post-content">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>{post.description}</p>
          )}
        </div>

        {/* Engagement Section */}
        <div className="engagement-section">
          <button className="vote-button" onClick={updateCount}>
            <svg className="vote-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.5 5.5C7.5 4.12 8.62 3 10 3s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S7.5 6.88 7.5 5.5zm4.75 4.5h4.25c.83 0 1.5.67 1.5 1.5 0 .83-.67 1.5-1.5 1.5H15.5l-.75 4.5-6.5-6.5H12.25z"/>
            </svg>
            <span className="vote-count">{count}</span>
          </button>
        </div>

        {/* Comments Section */}
        <section className="comments-section">
          <h3 className="comments-title">
            Responses ({comments.length})
          </h3>

          {/* Comment Form - Only show if user is signed in */}
          {currentUser ? (
            <form onSubmit={commentsubmissions} className="comment-form">
              <div className="comment-input-wrapper">
                <div className="comment-avatar-input">
                  {getUserInitials(currentUser.email)}
                </div>
                <div className="comment-input-group">
                  <textarea
                    placeholder="What are your thoughts?"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    required
                  />
                  <button type="submit" disabled={!commentText.trim()}>
                    Reply
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="sign-in-prompt">
              <p>Please <Link to="/signin">sign in</Link> to leave a comment.</p>
            </div>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-avatar">
                    {getUserInitials(comment.UserData)}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <div className="comment-header-left">
                        <span className="comment-author">
                          {getDisplayName(comment.UserData)}
                        </span>
                        <span className="comment-date">
                          {comment.created_at && formatDate(comment.created_at)}
                        </span>
                      </div>
                      <div className="comment-options">
                        <button className="comment-more-button">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                    <div className="comment-actions">
                      <button className="comment-action">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.5 5.5C7.5 4.12 8.62 3 10 3s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S7.5 6.88 7.5 5.5zm4.75 4.5h4.25c.83 0 1.5.67 1.5 1.5 0 .83-.67 1.5-1.5 1.5H15.5l-.75 4.5-6.5-6.5H12.25z"/>
                        </svg>
                        <span className="comment-likes">68</span>
                      </button>
                      <button className="comment-action">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L16.4 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                        1 reply
                      </button>
                      <button className="comment-action">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostPage;