import './App.css';
import banner from './assets/banner.jpeg';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom'
import ReadPosts from './pages/ReadPosts'
import CreatePenguin from './pages/CreatePenguin'
import EditPenguin from './pages/EditPenguin'
import { Link } from 'react-router-dom'
import PenguinDetail from './pages/PenguinDetail';
import { supabase } from './client';

const App = () => {
  function Navbar() {
    return (
      <div>
        <div className='navbar-container'>
          <h2>Navigation Bar</h2>
          <Link to="/"><h3 className="headerBtn"> Home  </h3></Link>
          <Link to="/new"><h3 className="headerBtn"> Create a Penguin 🔍  </h3></Link>
          <Link to="/view-all"><h3 className="headerBtn"> View all Penguins 🏆 </h3></Link>
        </div>
      </div>
    );
  }

  // State to store the fetched penguin data
  const [posts, setPosts] = useState([]);

  // Fetch penguin data from Supabase when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('ClubPenguin')
          .select('*');
    
        if (error) {
          throw error;
        }

    // Arrays of possible likes and dislikes
    const possibleLikes = ["pizza", "ice cream", "video games", "reading", "music"];
    const possibleDislikes = ["cold weather", "spiders", "traffic jams", "early mornings", "loud noises"];

    // Populate likes and dislikes with random values for each post
    const populatedData = data.map(post => ({
      ...post,
      likes: possibleLikes[Math.floor(Math.random() * possibleLikes.length)],
      dislikes: possibleDislikes[Math.floor(Math.random() * possibleDislikes.length)]
    }));

    setPosts(populatedData);
  } catch (error) {
    console.error('Error fetching penguin data:', error.message);
  }
};
    fetchPosts();
  }, []);

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: <ReadPosts data={posts} />
    },
    {
      path: "/new",
      element: <CreatePenguin />
    },
    {
      path: "/edit/:id",
      element: <EditPenguin data={posts} />
    },
    {
      path: "/view-all",
      element: <ReadPosts data={posts} />
    },
    {
      path: "/viewdetails/:id",
      element: <PenguinDetail data={posts} />
    },
  ]);

  return (
    <div className="App">
      <div className="header">
        <img src={banner} alt="image" className="banner-image" />
        <h3>Club Penguin</h3>
        <p>Join us and create your own character</p>
        <Navbar/>
      </div>
      {element}
    </div>
  );
}

export default App;