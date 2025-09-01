import { useEffect, useState } from 'react';
import { Link, useRoutes } from 'react-router-dom';
import './App.css';
import { supabase } from './client';
import User_Circle from './assets/User_Circle.svg';
import SignInModal from './components/SignInModel';
import Welcome from './pages/Welcome.jsx';
import NotFound from './pages/NotFound.jsx';
import ReadPosts from './pages/Blog/ReadPosts.jsx';
import PostPage from './pages/Blog/PostPage.jsx';
import EditPosts from './pages/Blog/EditPosts.jsx';
import CreateHabit from './components/CreateHabit.jsx';
import CreatePost from './pages/Blog/CreatePosts.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Blog from './pages/Blog/Blog.jsx';
import Goal from './pages/Goals.jsx';
import logo from './assets/icon.png';
import { useLocation } from 'react-router-dom'
import Authen from './components/authen';
import WalkthroughPage from './pages/Onboarding/WalkthroughPage.jsx';
import OnboardRoute from './pages/Onboarding/onboard';
import FeaturesPage from './pages/Features.jsx';
import  Footer from './components/Footer';
function App() {
  const [posts, setPosts] = useState([]);
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/onboarding')
const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    { path: "/onboarding", element: <OnboardRoute /> },
    { path: "/not-found", element: <NotFound /> },
    { path: "/the-posts", element: <ReadPosts data={posts}/> },
    { path: "/post/:id", element: <PostPage /> },
    { path: "/edit/:id", element: <EditPosts data={posts} /> },
    { path: "/create-post", element: <CreatePost data={posts} /> },
    { path: "/about-us", element: <AboutUs /> },
    { path: "/habit", element: <CreateHabit /> },
    { path: "/blog", element: <Blog /> },
    { path: "/goal", element: <Goal /> },
    { path: "*", element: <NotFound /> },
    { path: "/authen", element: <Authen /> },
    { path: "/features", element: <FeaturesPage /> },
    { path: "/walkthrough", element: <WalkthroughPage /> }, 
  ]);

  const [user, setUser] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] ||
                      user?.email?.split('@')[0] ||
                      "User";

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData?.user || session.user);
      } else {
        setUser(null);
      }
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.auth.getUser().then(({ data }) => {
          setUser(data?.user || session.user);
        });
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
      <div>      
        {!hideNav && (
        <div className='nav-bar'>
          <div className='logo-title-container'>
            <Link to="/"><img src={logo} alt="Logo" /></Link>
            <h3 className='logo-title'>Zeno</h3>
          </div>

          <SignInModal open={showSignInModal} onClose={() => setShowSignInModal(false)} />

          <div className="menu-items desktop-only">
            <Link to="/">Home</Link>
            <Link to="/goal">Goals</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/about-us">About Us</Link>
          </div>
        <div className="auth-actions desktop-only">
          {user ? (
            <div className="profile-wrapper">
              <img
                src={user?.user_metadata?.avatar_url || User_Circle}
                alt="User Avatar"
                className={`profile-pic ${showProfileMenu ? "active" : ""}`}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />
              {showProfileMenu && (
                <div className="profile-menu">
                  <button className="signout-btn" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="signout-btn"
              onClick={() => setShowSignInModal(true)}
            >
              Sign In
            </button>
          )}
        </div>
          <div className="hamburger-container" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
              <span className="bar top"></span>
              <span className="bar middle"></span>
              <span className="bar bottom"></span>
            </div>
          </div>
          {menuOpen && (
            <div className="menu-backdrop" onClick={() => setMenuOpen(false)}>
              <div className="menu-overlay open" onClick={(e) => e.stopPropagation()}>
                <ul>
                  <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                  <li><Link to="/goal" onClick={() => setMenuOpen(false)}>Goals</Link></li>
                  <li><Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
                  <li><Link to="/about-us" onClick={() => setMenuOpen(false)}>About Us</Link></li>
                  {user ? (
                    <li className="user-info">
                      <div className="user-details">
                        <img src={User_Circle} alt="User Icon" className="user-icon" />
                        <span className="greeting">Hi, {displayName.split(' ')[0]}</span>
                      </div>
                      <button 
                        className="signout-btn" 
                        onClick={() => {
                          handleSignOut();
                          setMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </button>
                    </li>
                  ) : (
                    <li>
                      <button 
                        className="signout-btn" 
                        onClick={() => {
                          setShowSignInModal(true);
                          setMenuOpen(false);
                        }}
                      >
                        Sign In
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        )}

        {element}
        <Footer/>
      </div>
      
  );
}

export default App;