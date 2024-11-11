import React, { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import './blog.css';
import { supabase } from './../../client';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('Blog')
          .select('*')
          .order('time', { ascending: false }); // Default sort when fetching
        if (error) throw error;
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchInput(value);
    if (value === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(value) ||
        post.description.toLowerCase().includes(value) ||
        post.author.toLowerCase().includes(value)
      );
      setFilteredPosts(filtered);
    }
  };

  const sortByDate = () => {
    const sortedPosts = [...filteredPosts].sort((a, b) => new Date(a.time) - new Date(b.time));
    setFilteredPosts(sortedPosts);
  };

  const sortByUpvotes = () => {
    const sortedPosts = [...filteredPosts].sort((a, b) => b.betcount - a.betcount);
    setFilteredPosts(sortedPosts);
  };
  
  return (
    <div className="BlogPost-s">
      <div className='sort-buttons'>
      <h1>Blog</h1>
      <p>Your go-to place for tips, stories, and insights on building better habits and achieving your goals. Join our community, get inspired, and start transforming your life today.</p>
          <div className='button-container'>
          <button className='organize' onClick={sortByDate}>Sort by Date</button>
          <button className='organize' onClick={sortByUpvotes}>Sort by Upvotes</button>
          <Link to="/create-post"><button className='create-btn'>Create New Post</button></Link></div>
          <input
          className='search'
          type="text"
          placeholder="🔍 Search posts..."
          value={searchInput}
          onChange={handleSearch}/>
      </div>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))
        ) : (
          <h2>No Blog posts found 😞</h2>
        )}
        <p>
        This page is still being worked on as of 7/19/24. <br />
        The goal is to create blog component where users can create new posts, remove or edit old posts, <br />
        You are able to vote, to trigger the counter, sort based on date and 'upvotes' <br />
        Users can press on a post to see more information about it <br />
        I am making changes to the expanded view of posts in order for it to <br />
        have more of a look to a real blog<br />
      </p>

    </div>
  );
};

export default Blog;
