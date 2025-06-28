import React from 'react';
import '../style/aboutus.css'; 
import {useNavigate } from 'react-router-dom';
const AboutUs = () => {
  const features = [
    'Homestyle Cooking',
    'On-Time Delivery',
    'Hygiene First',
    'Affordable Pricing',
    'Eco-Friendly Packaging',
  ];
  const navigate=useNavigate()

const exploremenu=()=>{
  navigate('/menu')
}  

  return (
    <div className="about-container">
      
      <section className="hero-section">
        <h1>Delivering Home-Cooked Happiness</h1>
        <p>Fresh, affordable, and wholesome meals — made with love, delivered with care.</p>
      </section>

      
      <section className="section">
        <h2>Our Story</h2>
        <p>
          We started <strong>e-Tiffin</strong> with a mission: to bring the warmth and goodness of home-cooked meals to everyone.
          Whether you are a student, a working professional, or someone living away from home, our tiffins are designed to remind you of the comfort of homemade food.
        </p>
      </section>

      
      <section className="section">
        <h2>What We Offer</h2>
        <div className="features-grid">
          {features.map((item, i) => (
            <div key={i} className="feature-card">
              {item}
            </div>
          ))}
        </div>
      </section>

      
      <section className="section">
        <h2>Why Choose Us</h2>
        <ul className="why-list">
          <li>Fresh Ingredients – no preservatives or frozen food</li>
          <li>Personalized Tiffin Options</li>
          <li>Customer Support that Cares</li>
          <li>Eco-friendly and sustainable practices</li>
        </ul>
      </section>

      <div className="cta-section">
        <button className="cta-button" onClick={exploremenu}>Explore Our Menu</button>
      </div>
    </div>
  );
};

export default AboutUs;
