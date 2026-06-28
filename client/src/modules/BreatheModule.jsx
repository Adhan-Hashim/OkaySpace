import React, { useState, useEffect } from 'react';

export default function BreatheModule({ onBack }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready | inhale | hold | exhale | hold-out
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    if (!isActive) {
      setPhase('ready');
      setTimeLeft(4);
      return;
    }

    let timer;
    let phaseDuration = 4000;
    
    const cycle = () => {
      setPhase((prev) => {
        switch (prev) {
          case 'ready': 
          case 'hold-out':
            return 'inhale';
          case 'inhale': return 'hold';
          case 'hold': return 'exhale';
          case 'exhale': return 'hold-out';
          default: return 'inhale';
        }
      });
    };

    if (isActive) {
      if (phase === 'ready') {
        cycle();
      }
      
      const interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            cycle();
            return 4;
          }
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'ready': return 'Ready';
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold-out': return 'Hold';
      default: return '';
    }
  };

  return (
    <div className="module-wrap">
      <div className="module-bg"></div>
      <button className="back-btn" onClick={onBack}>← Hub</button>
      
      <div className="module-content breathe-wrap">
        {!isActive ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', color: '#22c55e', marginBottom: '1rem' }}>Box Breathing</h2>
              <p style={{ color: 'var(--text-muted)' }}>4 seconds in. 4 seconds hold. 4 seconds out. 4 seconds hold.</p>
            </div>
            <button className="breathe-start" onClick={() => setIsActive(true)}>
              Start Breathing
            </button>
          </>
        ) : (
          <>
            <div className={`breathe-circle ${phase}`} onClick={() => setIsActive(false)}>
              <div className="breathe-phase">{getPhaseText()}</div>
              <div className="breathe-timer">{timeLeft}</div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2rem', cursor: 'pointer' }} onClick={() => setIsActive(false)}>
              Click circle to stop
            </p>
          </>
        )}
      </div>
    </div>
  );
}
