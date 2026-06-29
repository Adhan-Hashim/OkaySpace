import React from 'react';
import useStore from '../store/useStore';
import './Footer.css';

export default function Footer() {
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <footer className="gc-footer">
      
      {/* The bottom-right cutout shape */}
      <div className="gc-footer-cutout">
         <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="gc-curve-svg">
           {/* Shallower curve that stays low so it doesn't block the nav links */}
           <path d="M100,40 Q50,60 0,100 L100,100 Z" fill="var(--bg-warm)" />
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
          
          <div className="gc-brand-huge">
            <h1>Okay</h1>
            <div className="gc-brand-row">
               <h1>Space</h1>
               <div className="gc-small-logo-badge">OS</div>
            </div>
          </div>
          
          <div className="gc-newsletter">
            <p className="gc-newsletter-title">Sign up for our newsletter</p>
            <div className="gc-input-group">
              <input type="email" placeholder="Enter your email" className="gc-input" />
              <button className="gc-submit-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

        </div>

        {/* Right Side */}
        <div className="gc-footer-right">
          <h3 className="gc-nav-title">Find your <b>way</b></h3>
          <div className="gc-nav-links">
            <button onClick={() => setCurrentView('home')}>Home</button>
            <button onClick={() => setCurrentView('echo')}>Echo</button>
            <button onClick={() => setCurrentView('prism')}>Prism</button>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
