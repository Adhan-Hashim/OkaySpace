import React from 'react';
import useStore from '../store/useStore';
import logo from '../assets/logo.png';
import './Footer.css'; // We will create this

export default function Footer() {
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <footer className="dark-footer">
      <div className="dark-footer-inner">
        {/* Overlapping Logo */}
        <div className="dark-footer-logo-wrapper">
          <img src={logo} alt="OkaySpace Logo" className="dark-footer-logo" />
        </div>
        
        {/* Topographic Background Overlay */}
        <div className="dark-footer-bg"></div>

        <div className="dark-footer-content">
          {/* Left Column */}
          <div className="dark-footer-left">
             <div className="dark-footer-col">
                <h4 className="dark-footer-title">Contact</h4>
                <p>123 Wellness Way</p>
                <p>90210 Mindful City</p>
                <p>+1 800 555 0199</p>
                <p>hello@okayspace.com</p>
             </div>
             <div className="dark-footer-col">
                <a href="#" className="dark-footer-link">Instagram ↗</a>
                <a href="#" className="dark-footer-link">Twitter ↗</a>
                <a href="#" className="dark-footer-link">LinkedIn ↗</a>
             </div>
          </div>

          {/* Center Column */}
          <div className="dark-footer-center">
             <h2 className="dark-footer-heading t-serif">Neural Wellness OS</h2>
             <p className="dark-footer-tagline">Where mental clarity begins</p>
             <div className="dark-footer-buttons">
                <button className="dark-footer-btn primary-btn" onClick={() => setCurrentView('echo')}>Open Echo →</button>
                <button className="dark-footer-btn secondary-btn" onClick={() => setCurrentView('meditations')}>Meditations →</button>
             </div>
          </div>

          {/* Right Column */}
          <div className="dark-footer-right">
             <div className="dark-footer-col">
                <h4 className="dark-footer-title">Explore</h4>
                <button onClick={() => setCurrentView('home')} className="dark-footer-link">Home</button>
                <button onClick={() => setCurrentView('prism')} className="dark-footer-link">Prism</button>
                <button onClick={() => setCurrentView('nexus')} className="dark-footer-link">Nexus</button>
             </div>
             <div className="dark-footer-col">
                <h4 className="dark-footer-title">Practice</h4>
                <a href="#" className="dark-footer-link">Journal</a>
                <a href="#" className="dark-footer-link">Insights</a>
                <a href="#" className="dark-footer-link">Community</a>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="dark-footer-bottom">
           <div className="dark-footer-legal-pill">
              <a href="#">Cookies policy</a>
              <a href="#">Privacy policy</a>
              <span>© {new Date().getFullYear()}</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
