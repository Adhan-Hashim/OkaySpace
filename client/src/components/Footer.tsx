import React from 'react';
import bgPhoto from '../assets/footer-photo-bg.png';
import logo from '../assets/logo.png';
import malayalamLogo from '../assets/malayalam-logo.svg';
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
            <p>@chattipathal</p>
            <p>hello@okayspace.com | okayspace.com</p>
          </div>
        </div>
        
      </footer>
    </div>
  );
}
