import React,{ useState,useEffect } from 'react';
import {Link, useRoutes} from 'react-router-dom';
import './App.css';
import logo from './assets/logo.png';

import Welcome from './pages/Welcome.jsx';
import NotFound from './pages/NotFound.jsx';
import ReadPosts from './pages/Blog/ReadPosts.jsx';
import PostPage from './pages/PostPage.jsx';
import EditPosts from './pages/Blog/EditPosts.jsx';
import CreateHabit from './components/CreateHabit.jsx';
import CreatePost from './pages/Blog/CreatePosts.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Blog from './pages/Blog/Blog.jsx';
import Goal from './pages/Goals.jsx';


function App() {
  const element = useRoutes([
    {path: "/", element: <Welcome/>},
    {path: "/not-found", element: <NotFound />},
    // {path: "/the-posts", element: <ReadPosts data={posts}/>}, //wont know this yet
    {path: "/post-page", element: <PostPage />},
    // {path: "/edit-post", element: <EditPosts data={posts} />},
    {path: "/habit", element: <CreateHabit />},
    //{path: "/create-post", element: <CreatePosts data={posts} />},
    {path: "/about-us", element: <AboutUs  />},
    {path: "/blog", element: <Blog  />},
    {path: "/goal", element: <Goal  />},
  ]);

  return (
    <>
    <div>
        <div className='nav-bar'>
          <div className='logo-title-container'>
            <img className='logo' src={logo} alt="Logo" />
            <h1>HabitHab</h1>
        </div>
          <div className='menu-items'>
          <Link to= '/'>Home</Link>
          <Link to= '/goal'>Goals</Link>
          <Link to= '/blog'>Blog</Link>
          <Link to= '/about-us'>About Us</Link>
          </div>
        </div>
        {element}
      </div>
    </>
  )
}

export default App
