import React from 'react';
import useStore from '../store/useStore';
import logo from '../assets/logo.png';
import './Footer.css'; // We will create this

export default function Footer() {
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <footer className="light-footer">
      <div className="light-footer-inner">
        <div className="light-footer-brand">
          <img src={logo} alt="OkaySpace Logo" className="light-footer-logo" />
          <p className="light-footer-tagline">A sanctuary for your mind. You don't have to be okay to come here.</p>
        </div>
        
        <div className="light-footer-links">
          <div className="light-footer-col">
            <span className="light-footer-title">Explore</span>
            <button onClick={() => setCurrentView('home')}>Home</button>
            <button onClick={() => setCurrentView('echo')}>Echo</button>
            <button onClick={() => setCurrentView('prism')}>Prism</button>
          </div>
          <div className="light-footer-col">
            <span className="light-footer-title">Practice</span>
            <button onClick={() => setCurrentView('meditations')}>Meditations</button>
            <button onClick={() => setCurrentView('nexus')}>Nexus</button>
            <button onClick={() => setCurrentView('cortex')}>Cortex</button>
          </div>
          <div className="light-footer-col">
            <span className="light-footer-title">Legal</span>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="light-footer-bottom">
        <p>© {new Date().getFullYear()} OkaySpace. Neural Wellness OS.</p>
        <div className="light-footer-social">
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
