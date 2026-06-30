import React from 'react';
import bgPhoto from '../assets/footer-photo-bg.png';
import logo from '../assets/logo.png';
import malayalamLogo from '../assets/malayalam-logo.png';
import './Footer.css';

export default function Footer() {
  return (
    <div className="ss-footer-wrapper">
      <footer className="ss-footer">
        
        <div className="ss-left">
          <img src={logo} alt="OkaySpace Logo" className="ss-character" />
        </div>

        <div className="ss-center">
          <img src={malayalamLogo} alt="Malayalam Logo" className="ss-center-logo" />
        </div>

        <div className="ss-right">
          <div className="ss-contact">
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              @chattipathal
            </p>
            <p>hello@okayspace.com</p>
          </div>
        </div>
        
      </footer>
    </div>
  );
}
