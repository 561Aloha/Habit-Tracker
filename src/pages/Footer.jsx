// src/pages/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/icon.png';
import './../App.css'; // Assuming you have a CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">



        <nav className="footer-right">
          <ul className="footer-nav">
            <li><Link to="/" className="footer-nav-link">Home</Link></li>
            <li><Link to="/about-us" className="footer-nav-link">About</Link></li>
            <li><Link to="/blog" className="footer-nav-link">Blog</Link></li>
            <li><Link to="/goal" className="footer-nav-link">Goals</Link></li>
            <li><Link to="/contact" className="footer-nav-link">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
