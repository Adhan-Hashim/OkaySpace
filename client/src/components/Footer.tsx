import React from 'react';
import useStore from '../store/useStore';
import logo from '../assets/logo.png';
import './Footer.css';

export default function Footer() {
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <footer className="gc-footer-container">
      <div className="gc-footer">
        
        {/* The bottom-right cutout shape */}
        <div className="gc-footer-cutout">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="gc-curve-svg">
             <path d="M100,0 Q15,15 0,100 L100,100 Z" fill="var(--bg-warm)" />
           </svg>
           <div className="gc-cutout-content">
              <div className="gc-socials">
                <a href="#" className="gc-social-btn">Ig</a>
                <a href="#" className="gc-social-btn">Fb</a>
                <a href="#" className="gc-social-btn">In</a>
              </div>
           </div>
        </div>

        <div className="gc-footer-content">
          {/* Left Side */}
          <div className="gc-footer-left">
            <div className="gc-logo-container">
              <img src={logo} alt="OkaySpace Logo" className="gc-logo" />
            </div>
            
            <div className="gc-newsletter">
              <p className="gc-newsletter-title">Sign up for our newsletter</p>
              <div className="gc-input-group">
                <input type="email" placeholder="Enter your email" className="gc-input" />
                <button className="gc-submit-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="gc-footer-right">
            <h3 className="gc-nav-title">Find your way</h3>
            <div className="gc-nav-links">
              <button onClick={() => setCurrentView('home')}>Home</button>
              <button onClick={() => setCurrentView('echo')}>Echo</button>
              <button onClick={() => setCurrentView('prism')}>Prism</button>
              <button onClick={() => setCurrentView('meditations')}>Meditations</button>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
