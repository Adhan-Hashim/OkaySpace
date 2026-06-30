import React from 'react';
import logo from '../assets/logo.png';
import './Footer.css';

export default function Footer() {
  return (
    <div className="ss-footer-wrapper">
      <footer className="ss-footer">
        
        <div className="ss-left">
          <img src={logo} alt="OkaySpace Logo" className="ss-character" />
        </div>

        <div className="ss-center">
          <h1 className="ss-title">OKAYSPACE</h1>
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
