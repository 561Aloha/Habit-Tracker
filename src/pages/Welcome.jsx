import React from 'react';
import '../App.css';
import myImage from '../assets/wellness.jpeg';
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

    </div>
    );
};

export default Welcome;