import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png';
import '../style/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-section">
          <h3>
            <NavLink to="/">
              <img src={Logo} alt="Logo" className="nav-logo" />
            </NavLink>
          </h3>
          <p>It's not just about bringing you good food from restaurants — we deliver you an experience.</p>

          <h3>Follow Us On</h3>
          <div className="social-icons">
            <a href="#" aria-label="Website">🌐</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📸</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="linkContainer">
            <NavLink to="/" className="Quicklink">Home</NavLink>
            <NavLink to="/menu" className="Quicklink">Menu</NavLink>
            <NavLink to="/offers" className="Quicklink">Offers</NavLink>
            <NavLink to="/about" className="Quicklink">About Us</NavLink>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@etiffinservice.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Sidsar, Bhavnagar, India</p>
        </div>

      </div>

      <div className="footer-bottom">
        &copy; 2025 E-Tiffin Service. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
