import React, { useEffect, useState } from 'react';
import { Link, useRoutes } from 'react-router-dom';
import './App.css';

import Welcome from './pages/Welcome.jsx';
import NotFound from './pages/NotFound.jsx';
import ReadPosts from './pages/Blog/ReadPosts.jsx';
import PostPage from './pages/Blog/PostPage.jsx';
import EditPosts from './pages/Blog/EditPosts.jsx';
import CreateHabit from './components/createhabit.jsx';

import CreatePost from './pages/Blog/CreatePosts.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Blog from './pages/Blog/Blog.jsx';
import Goal from './pages/Goals.jsx';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('Blog')
          .select('*')
          .order('time', { ascending: false });
        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, []);
  const element = useRoutes([
    { path: "/", element: <Welcome /> },
    { path: "/not-found", element: <NotFound /> },
    { path: "/the-posts", element: <ReadPosts data={posts}/> }, 
    { path: "/post/:id", element: <PostPage /> }, // Dynamic route to handle post IDs
     {path: "/edit-post", element: <EditPosts data={posts} />},
    { path: "/habit", element: <CreateHabit /> },
    { path: "/create-post", element: <CreatePost data={posts} /> },
    { path: "/about-us", element: <AboutUs  /> },
    { path: "/blog", element: <Blog  /> },
    { path: "/goal", element: <Goal  /> },
  ]);

  return (
    <>
      <div>
        <div className='nav-bar'>
          <div className='logo-title-container'>
            {/* <img className='logo' src={logo} alt="Logo" /> */}
            <h2>HabitHab</h2>
          </div>
          <h4 className='hidden'>Menu</h4>
          <div className='menu-items'>
            <Link to='/'>Home</Link>
            <Link to='/goal'>Goals</Link>
            <Link to='/blog'>Blog</Link>
            <Link to='/about-us'>About Us</Link>
          </div>
        <button className='signin'>Sign in</button>

        </div>
        {element}
      </div>
    </>
  );
}

export default App;
