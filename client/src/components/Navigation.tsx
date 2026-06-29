import React from 'react';
import useStore from '../store/useStore';

const MODULES = [
  { id: 'home', label: 'About Us' },
  { id: 'echo', label: 'Echo' },
  { id: 'prism', label: 'Prism' },
  { id: 'meditations', label: 'Meditations' },
  { id: 'nexus', label: 'Nexus' },
];

export default function Navigation() {
  const currentView = useStore((s) => s.currentView);
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <nav className="nav-topbar">
      <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}>
        OKAYSPACE
      </a>
      
      <button className="mobile-menu-btn">
        ☰
      </button>

      <div className="nav-items">
        {MODULES.map((m) => (
          <button
            key={m.id}
            className={`nav-item ${currentView === m.id ? 'active' : ''}`}
            onClick={() => setCurrentView(m.id)}
          >
            {m.label}
          </button>
        ))}
        
        {/* An extra accent button just for aesthetics to match the COLOSSAL style */}
        <button className="nav-item" style={{ background: 'var(--text-primary)', color: 'var(--surface-solid)', padding: '0.4rem 0.8rem' }}>
          Explore
        </button>
      </div>
    </nav>
  );
}
