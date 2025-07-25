import React from 'react';
import '../App.css';
import myImage from '../assets/wellness.jpeg';
import first from '../assets/298.jpeg';
import second from '../assets/298.jpeg';
import third from '../assets/298.jpeg';
import howitworks from '../assets/298.jpeg';
import HowItWorks from '../components/HowItWorks';

const Welcome = () => {
    return(
    <div >
        <div className='header'>
            <div className='header-content'>
                <h1>Habit Tracking Made Easier</h1>
                <h4>Let us help you towards progress. Our daily routine app is a great way 
                to stay on track and keep you motivated.
                </h4>
                <div className='cta-buttons'>
                    <button>Explore Features</button>
                </div>
             </div>
             <div className='banner-img-container'>             <img className='banner-img' src={myImage} alt='photo credits:MUTI'/>
</div>
        </div>

        <HowItWorks/>
      <div className='blogfeature'>
        <h2>Our Blog</h2>
        <div className='wrapper'>
        <div className='blogpost'>
          <img src={first} alt='blog post 1' />
          <h4>How it build good habits</h4>
          <p>Learn how to build good habits and stick to them with our expert tips and advice.</p>
        </div>
                <div className='blogpost'>
          <img src={first} alt='blog post 1' />
          <h4>How it build good habits</h4>
          <p>Learn how to build good habits and stick to them with our expert tips and advice.</p>
        </div>
          <div className='blogpost'>
          <img src={first} alt='blog post 1' />
          <h4>How it build good habits</h4>
          <p>Learn how to build good habits and stick to them with our expert tips and advice.</p>
        </div>
          <div className='blogpost'>
          <img src={first} alt='blog post 1' />
          <h4>How it build good habits</h4>
          <p>Learn how to build good habits and stick to them with our expert tips and advice.</p>
        </div>
        
        
        </div>
      </div>
    
    </div>

    );
};

export default Welcome;