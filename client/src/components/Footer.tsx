import React from 'react';
import character from '../assets/character.png';
import './Footer.css';

export default function Footer() {
  return (
    <div className="ss-footer-wrapper">
      <footer className="ss-footer">
        
        <div className="ss-left">
          <img src={character} alt="OkaySpace Character" className="ss-character" />
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
