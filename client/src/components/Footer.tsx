import React from 'react';
import useStore from '../store/useStore';
import logo from '../assets/logo.png';
import './Footer.css'; // We will create this

export default function Footer() {
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <footer className="creative-footer">
      <div className="creative-footer-inner">
        <div className="creative-footer-top">
          <div className="creative-footer-brand">
            <img src={logo} alt="OkaySpace Logo" style={{ height: '60px', objectFit: 'contain', marginBottom: '1rem', mixBlendMode: 'multiply' }} />
            <p className="t-italic t-serif" style={{ fontSize: '1.2rem', color: 'var(--text)', maxWidth: '300px' }}>
              Alam selalu menjadi tempat yang nyaman untuk menyembuhkan diri yang lelah.
            </p>
            <p className="t-sans" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              (Nature is always a comfortable place to heal a tired self.)
            </p>
          </div>
          <div className="creative-footer-links">
             <div className="footer-nav-col">
                <span className="t-label">Modules</span>
                <button onClick={() => setCurrentView('echo')}>Echo</button>
                <button onClick={() => setCurrentView('prism')}>Prism</button>
                <button onClick={() => setCurrentView('meditations')}>Meditations</button>
                <button onClick={() => setCurrentView('nexus')}>Nexus</button>
             </div>
             <div className="footer-nav-col">
                <span className="t-label">Connect</span>
                <a href="#">About</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Contact</a>
             </div>
          </div>
        </div>
        
        <div className="creative-footer-bottom">
          <div className="creative-footer-credit">
            Creative story by <span style={{ fontWeight: 600 }}>OkaySpace</span>
          </div>
          <div className="creative-footer-year">
            {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}
