import React, { useState, useEffect } from 'react';
import './blog-card.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { supabase } from './../../client';

const BlogCard = (props) => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate(); // Create an instance of useNavigate

  useEffect(() => {
    const getCount = async () => {
      const { data, error } = await supabase
        .from('Blog')
        .select('betcount')
        .eq('id', props.id);
      if (data && data.length > 0) {
        setCount(data[0].betcount);
      }
    };

    getCount();
  }, [props.id]);

  const updateCount = async (event) => {
    event.preventDefault();
    event.stopPropagation(); // Stop click event from propagating
    await supabase.from('Blog').update({ betcount: count + 1 }).eq('id', props.id);
    setCount(count + 1);
  };


  return (
    <div className='blogpost'>
    <Link to={`/post/${props.id}`} className="BlogCard" style={{ textDecoration: 'none' }}>

      <img src={props.image} className='post-img' alt="Post" />
      <div className="content">
        <h2 className="title">{props.title}</h2> 
        <p className="preview">{props.description}</p>
        <div className="upvotes">
          👍 The Upvotes: {count}
          <button className="betButton" onClick={updateCount}>Vote 🗳️</button>
        </div>
      </div>
    </Link>    </div>
 );
};

export default BlogCard;
