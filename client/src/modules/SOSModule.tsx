import React from 'react';

export default function SOSModule({ onBack }) {
  return (
    <div className="module-wrap" style={{ background: '#050505' }}>
      <button className="back-btn" onClick={onBack}>← Hub</button>
      
      <div className="module-content sos-wrap">
        <h1>You are not alone.</h1>
        <p className="sos-sub">If you are in immediate danger or feeling overwhelmed, please reach out. People want to help you.</p>
        
        <div className="sos-breathe">
          Breathe with me
        </div>

        <div className="crisis-card glass" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
          <h3>Immediate Help</h3>
          
          <div className="crisis-line">
            <span className="crisis-name">Emergency</span>
            <span className="crisis-number">911</span>
          </div>
          <div className="crisis-line">
            <span className="crisis-name">Suicide & Crisis Lifeline</span>
            <span className="crisis-number">988</span>
          </div>
          <div className="crisis-line">
            <span className="crisis-name">Crisis Text Line</span>
            <span className="crisis-number">Text HOME to 741741</span>
          </div>
        </div>

        <div className="micro-actions">
          <h3>Right now, try to:</h3>
          <div className="micro-action glass">
            <span className="action-num">1</span>
            <span>Drink a glass of water.</span>
          </div>
          <div className="micro-action glass">
            <span className="action-num">2</span>
            <span>Focus on 3 things you can see around you.</span>
          </div>
          <div className="micro-action glass">
            <span className="action-num">3</span>
            <span>Change your physical position (sit up, stand, etc).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
