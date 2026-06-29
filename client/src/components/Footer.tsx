import React from 'react';
import useStore from '../store/useStore';
import logo from '../assets/logo.png';
import './Footer.css';

export default function Footer() {
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <footer className="z-footer">
      {/* MASSIVE TITLE */}
      <div className="z-huge-title">OKAYSPACE</div>
      
      {/* NEWSLETTER PILL */}
      <div className="z-newsletter-container">
        <div className="z-newsletter-pill">
          <input type="email" placeholder="Your email address" />
          <button>Subscribe</button>
        </div>
        <p>Updates, resources, and mindfulness tips delivered every once in a while.</p>
      </div>

      {/* SOCIALS */}
      <div className="z-socials">
        <a href="#">Fb</a>
        <a href="#">In</a>
        <a href="#">X</a>
        <a href="#">Ig</a>
      </div>

      {/* LINKS GRID */}
      <div className="z-links-grid">
        <div className="z-links-col">
          <span className="z-col-title">SUPPORT</span>
          <a href="#">FAQ</a>
          <a href="#">Blog</a>
          <a href="#">(555) 123-4567</a>
        </div>
        <div className="z-links-col">
          <span className="z-col-title">PRODUCT</span>
          <button onClick={() => setCurrentView('home')}>Home</button>
          <button onClick={() => setCurrentView('echo')}>Echo AI</button>
          <button onClick={() => setCurrentView('prism')}>Prism</button>
          <button onClick={() => setCurrentView('meditations')}>Meditations</button>
        </div>
        <div className="z-links-col">
          <span className="z-col-title">COMPANY</span>
          <a href="#">Careers</a>
          <a href="#">Partners</a>
          <a href="#">About Us</a>
        </div>
        <div className="z-links-col">
          <span className="z-col-title">LEGAL</span>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="z-marquee-container">
        <div className="z-marquee-track">
          <span>Find your center</span>
          <span className="z-marquee-dot">•</span>
          <span>You don't have to be okay to come here</span>
          <span className="z-marquee-dot">•</span>
          <span>Neural Wellness OS</span>
          <span className="z-marquee-dot">•</span>
          <span>Find your center</span>
          <span className="z-marquee-dot">•</span>
          <span>You don't have to be okay to come here</span>
          <span className="z-marquee-dot">•</span>
          <span>Neural Wellness OS</span>
          <span className="z-marquee-dot">•</span>
          <span>Find your center</span>
          <span className="z-marquee-dot">•</span>
          <span>You don't have to be okay to come here</span>
          <span className="z-marquee-dot">•</span>
          <span>Neural Wellness OS</span>
          <span className="z-marquee-dot">•</span>
        </div>
      </div>
    </footer>
  );
}
