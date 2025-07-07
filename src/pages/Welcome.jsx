import React from 'react';
import '../App.css';
import myImage from '../assets/wellness.jpeg';
import first from '../assets/298.jpeg';
import second from '../assets/298.jpeg';
import third from '../assets/298.jpeg';
import howitworks from '../assets/298.jpeg';

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
             {/* <img className='banner-img' src={myImage} alt='photo credits:MUTI'/> */}

        </div>
      <div className='newpage'>

        <h1> How it works</h1>
        <h4> Welcome to Habit Tracker, where your journey to self-improvement begins! Our platform is designed to help you establish, track, and maintain your habits to achieve your personal 
        and professional goals. Here’s how you can get started:</h4>
    
        <div className='space-containers'>
            <div className='space'>
              <img className='adv-img-sm' src={third} />
              <h4>Convenience and Accessibility</h4>
              <p>Our user-friendly platform seamlessly fits your busy lifestyle</p>
            </div>
            <div className='space'>
              <img className='adv-img-sm' src={third} />
              <h4>Convenience and Accessibility</h4>
              <p>Our user-friendly platform seamlessly fits your busy lifestyle</p>
            </div>
            <div className='space'>
              <img className='adv-img-sm' src={third} />
              <h4>Convenience and Accessibility</h4>
              <p>Our user-friendly platform seamlessly fits your busy lifestyle</p>
            </div></div>

      </div>
    
    </div>

    );
};

export default Welcome;