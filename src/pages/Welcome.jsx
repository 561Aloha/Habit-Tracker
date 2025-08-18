import React from 'react';
import '../css/welcome.css';
import myImage from '../assets/wellness.jpeg';
import iconImg from '../assets/We.png'
import HowItWorks from '../components/HowItWorks';
import Footer from './../components/Footer';
import { Link } from 'react-router-dom';
import ScrollRevealBackdrop from '../components/ScrollReveal';

const Welcome = () => {
    return(
    <div >
                    <div className='header-content'>
                <h1>Habit Tracking Made Easier</h1>
                <h4>Let us help you towards progress.<br></br> Our daily routine app is a great way 
                to stay on track and keep you motivated.
                </h4>
                <div className='cta-buttons'>
                    <Link to="/features"><button>Explore Features</button></Link>
                </div>
             </div>
        <ScrollRevealBackdrop />
        <div className='header'>

             {/* <div className='banner-img-container'>             <img className='banner-img' src={myImage} alt='photo credits:MUTI'/>
            </div> */}
        </div>
        <div className='howitworks-div'>
            <div className='quick-intro'>
            <h2>Break old patterns, <br></br>
            form new habits
            </h2><p>How you feel matters! Whether you're feeling sad, anxious, or stressed, Happify brings you effective tools and programs to help you take control of your feelings and thoughts.
            <br></br>
            <br></br>
            Our proven techniques are developed by leading scientists and experts who've been studying evidence-based interventions in the fields of positive psychology, mindfulness, and cognitive behavioral therapy for decades.</p></div>
            
            <img src={iconImg}></img>

        </div>
        <HowItWorks/>
        <Footer/>
    </div>
    );
};

export default Welcome;