import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../client';
import '../../css/about-us.css';
import '../../css/postpage.css';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [user_id, setUserID] = useState('');
  const [commentText, setCommentText] = useState('');
  const [count, setCount] = useState(0);
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
        const { data: postData, error: postErr } = await supabase
          .from('Blog')
          .select('*')
          .eq('id', id)
          .single();

        if (!postErr && postData) {
          const formattedTime = postData.time
            ? new Date(postData.time)
            : null;
          setPost({
            ...postData,
            time: formattedTime
              ? `${formattedTime.getMonth() + 1}/${formattedTime.getDate()}/${formattedTime.getFullYear()}`
              : '',
          });
        }

        const { data: commentsData } = await supabase
          .from('Comments')
          .select('*')
          .eq('post_id', id);

        setComments(commentsData || []);

        const { data: countData } = await supabase
          .from('Blog')
          .select('betcount')
          .eq('id', id)
          .single();

        setCount(countData?.betcount ?? 0);
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
    event.stopPropagation();
    const { error } = await supabase
      .from('Comments')
      .insert([{ post_id: id, user_id, text: commentText }]);
    if (!error) {
      setComments((prev) => [...prev, { user_id, text: commentText }]);
      setCommentText('');
      setUserID('');
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="postpage-f">
      <div className="title-container">
        <Link to={`/blog/edit/${post.id}`}>Edit</Link>
        <h1>{post.title}</h1>
      </div>

      <p>Author: {post.author}</p>
      <p>Date: {post.time}</p>
      <p className="description">{post.description}</p>

      {post.image ? <img src={post.image} className="post-img" alt="Post" /> : null}

      <div className="upvotes">
        👍 The Upvotes: {count}
        <button className="betButton" onClick={updateCount}>Vote 🗳️</button>
      </div>

      <div className="comments">
        {comments?.map((comment, index) => (
          <div key={index} className="comments-i">
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
