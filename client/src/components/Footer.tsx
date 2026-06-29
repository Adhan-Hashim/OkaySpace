import React from 'react';
import useStore from '../store/useStore';
import logo from '../assets/logo.png';
import './Footer.css'; // We will create this

export default function Footer() {
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <footer className="creative-footer">
      <div className="hero-footer-inner">
        <div className="footer-hero-logo-container">
          <img src={logo} alt="OkaySpace Logo" className="footer-hero-logo" />
        </div>
        
        <div className="footer-nav-grid">
          <div className="footer-nav-col">
            <span className="t-label">Explore</span>
            <button onClick={() => setCurrentView('echo')}>Echo</button>
            <button onClick={() => setCurrentView('prism')}>Prism</button>
          </div>
          <div className="footer-nav-col">
            <span className="t-label">Practice</span>
            <button onClick={() => setCurrentView('meditations')}>Meditations</button>
            <button onClick={() => setCurrentView('nexus')}>Nexus</button>
          </div>
          <div className="footer-nav-col">
            <span className="t-label">Connect</span>
            <a href="#">About Us</a>
            <a href="#">Manifesto</a>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© {new Date().getFullYear()} OkaySpace.</span>
          <span className="t-italic">Neural Wellness OS</span>
        </div>
      </div>
    </footer>
  );
}
