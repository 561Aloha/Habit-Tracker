import React from 'react';
import '../App.css';
import myImage from '../assets/wellness.jpeg';
import first from '../assets/298.png';
import second from '../assets/299.png';
import third from '../assets/300.png';
import howitworks from '../assets/Frame13.png';

const Welcome = () => {
    return(
    <div className='containerr'>
    <div className='header-banner'>
        <div className='header'>
            <div className='header-content'>
                <h1>Habit Tracking Made Easier</h1>
                <h4>Let us help you towards progress. Our daily routine app is a great way 
                to stay on track and keep you motivated.
                </h4>
                <div className='cta-buttons'>
                    <button>Start a Free Trial</button>
                    <button>Explore Features</button>
                </div>
             </div>
             <img className='banner-img' src={myImage} alt='photo credits:MUTI'/>

        </div>
    </div>

      <div className='adv-comp'>
        <div className='adv-box'>
          <h1 className='advantages'>Advantages</h1>
          <div className='box-sm'>
            <div className='space'>
              <img className='adv-img-sm' src={first} />
              <h4>Customized Habit Tracking</h4>
              <p>Tailor your journey to fit your unique goals and preferences. We will help you adapt to your needs</p>
            </div>
            <div className='space'>
              <img className='adv-img-sm' src={second} />
              <h4>Progress Monitoring</h4>
              <p>Visualize your progress and celebrate your achievements with intuitive tracking tools</p>
            </div>
            <div className='space'>
              <img className='adv-img-sm' src={third} />
              <h4>Convenience and Accessibility</h4>
              <p>Our user-friendly platform seamlessly fits your busy lifestyle</p>
            </div>
          </div>
          </div>
        <div className='howitworks'>
          <h2>How it Works</h2>
          <img className='howitworks-img' src={howitworks} /></div>
      </div>

    </div>

    
    );
};

export default Welcome;