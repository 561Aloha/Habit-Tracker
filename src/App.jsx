import React, { useEffect, useState } from 'react';
import { Link, useRoutes } from 'react-router-dom';
import './App.css';
import { supabase } from './client';

import Welcome from './pages/Welcome.jsx';
import NotFound from './pages/NotFound.jsx';
import ReadPosts from './pages/Blog/ReadPosts.jsx';
import PostPage from './pages/Blog/PostPage.jsx';
import EditPosts from './pages/Blog/EditPosts.jsx';
import LoginWithGoogle from './components/LoginWithGoogle';
import EmailLogin from './components/EmailLogin';

import CreateHabit from './components/CreateHabit.jsx';
import SignInModal from './components/SignInModel.jsx'; 
import CreatePost from './pages/Blog/CreatePosts.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Blog from './pages/Blog/Blog.jsx';
import Goal from './pages/Goals.jsx';

function App() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log('User signed in:', session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    { path: "/create-post", element: <CreatePost data={posts} /> },
    { path: "/about-us", element: <AboutUs  /> },
    { path: "/habit", element: <CreateHabit /> },
    { path: "/blog", element: <Blog  /> },
    { path: "/goal", element: <Goal  /> },
  ]);

  /* Nav Bar */
  const [user, setUser] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email ||
    "User";
  useEffect(() => {
    if (user) setShowSignInModal(false);
  }, [user]);

    

  return (
    <>
      <div>
        <div className='nav-bar'>
          <div className='logo-title-container'>
            <h2>HabitHab</h2>
          </div>
          <h4 className='hidden'>Menu</h4>
          <div className='menu-items'>
            <Link to='/'>Home</Link>
            <Link to='/goal'>Goals</Link>
            <Link to='/blog'>Blog</Link>
            <Link to='/about-us'>About Us</Link>
          </div>
            <div className='signin-container'>
    {user ? (
      <div className="user-info">
        <span className="greeting">Hi, {displayName.split(' ')[0]}</span>
        <button
          className="signout-btn"
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
          }}
        >
          Sign Out
        </button>
      </div>
    ) : (
      <button
        className="auth-btn"
        onClick={() => setShowSignInModal(true)}
        style={{
          background: '#2979ff',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
          padding: '8px 20px',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Sign In
      </button>
    )}
          </div>

        <SignInModal open={showSignInModal} onClose={() => setShowSignInModal(false)} />

        </div>
        {element}
      </div>
    </>
  );
}

export default App;
