import React from 'react';
import useStore from '../store/useStore';
import logo from '../assets/logo.png';
import './Footer.css'; // We will create this

export default function Footer() {
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <footer className="creative-footer">
      <div className="minimal-footer-inner">
        <div className="footer-left">
          <img src={logo} alt="OkaySpace Logo" className="footer-logo-img" />
          <span className="footer-tagline">Neural Wellness OS</span>
        </div>
        
        <div className="footer-right">
          <div className="footer-links">
             <button onClick={() => setCurrentView('echo')}>Echo</button>
             <button onClick={() => setCurrentView('prism')}>Prism</button>
             <button onClick={() => setCurrentView('meditations')}>Meditations</button>
             <button onClick={() => setCurrentView('nexus')}>Nexus</button>
          </div>
          <div className="footer-meta">
            <span>© {new Date().getFullYear()}</span>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
