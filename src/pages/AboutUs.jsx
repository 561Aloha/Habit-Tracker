import React from "react";
import './../css/about-us.css'; 
import Footer from '../components/Footer.jsx';

const AboutUs = () => {
    return (
      <div className="about-us-c">
        <div className="about-us">
          <h1>About Us</h1>
          <p>Welcome to Health Planner Pro! We are dedicated to helping you achieve your health and wellness goals.</p>
          <p>Our mission is to provide you with the tools and resources you need to create healthy habits, track your progress, and live a happier, healthier life.</p>
          <p>At Health Planner Pro, we believe that small changes can lead to big results. Whether you're looking to lose weight, improve your fitness, or simply adopt a healthier lifestyle, we're here to support you every step of the way.</p>
          <p>Feel free to explore our website and discover how we can help you reach your health and wellness goals. Thank you for choosing Health Planner Pro!</p>
          <img className='image' src='https://cdn.dribbble.com/userupload/2951143/file/original-171bc08c9f7da2d5a11b74913a925053.png?resize=1024x637'></img>
        </div>
      </div>
    );
  }
export default AboutUs;