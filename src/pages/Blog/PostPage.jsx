import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../client';
import EditPost from './EditPosts';
import more from './more.svg';
import { Link } from 'react-router-dom';
import '../../css/about-us.css'; 
import '../../css/postpage.css'; 

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [user_id, setUserID] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase.from('Blog').select('*').eq('id', id).single();
        if (error) throw error;
        setPost(data);

        const { data: commentsData, error: commentsError } = await supabase
          .from('Comments')
          .select('*')
          .eq('post_id', id);
        if (commentsError) throw commentsError;
        if (data && data.time) {
          const date = new Date(data.time);
          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
          data.time = formattedDate;
        }

        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching post:', error.message);
      }
    };

    fetchPost();
  }, [id]);

  const commentsubmissions = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const { error } = await supabase.from('Comments').insert([{ post_id: id, user_id: user_id, text: commentText }]);
      if (error) throw error;
      setComments((prev) => [...prev, { user_id: user_id, text: commentText }]);
      setCommentText('');
      setUserID('');
    } catch (error) {
      console.error('Error posting comment:', error.message);
    }
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    navigate(`/blog/edit/${id}`);
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className='postpage-f'>

      <div className='title-container'>
        <Link to={`/edit/${post.id}`}>Edit</Link>

        <h1>{post.title}</h1>
           </div>
      <p>Author: {post.author}</p>
      <p>Date: {post.time}</p>
      <p className='description'>{post.description}</p>

      <img src={post.image} className='post-img' alt="Post" />

      <div className='comments'>
        {comments &&
          comments.map((comment, index) => (
            <div key={index} className='comments-i'>
              <p>
                {comment.user_id} said: {comment.text}
              </p>
            </div>
          ))}
        <form onSubmit={commentsubmissions}>
          <input
            type="text"
            placeholder="User ID"
            value={user_id}
            onChange={(e) => setUserID(e.target.value)}
          />
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">Leave a Comment</button>
        </form>
      </div>
    </div>
  );
};

export default PostPage;
