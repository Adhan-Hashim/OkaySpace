import React, { useState } from 'react';
import useStore from '../store/useStore';
import logo from '../assets/logo.png';

const MODULES = [
  { id: 'home',        label: 'About',       emoji: '🌿' },
  { id: 'echo',        label: 'Echo',         emoji: '💬' },
  { id: 'prism',       label: 'Prism',        emoji: '🔮' },
  { id: 'meditations', label: 'Meditations',  emoji: '🌸' },
  { id: 'nexus',       label: 'Nexus',        emoji: '🌌' },
];

export default function Navigation() {
  const currentView = useStore((s) => s.currentView);
  const setCurrentView = useStore((s) => s.setCurrentView);
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (id: string) => {
    setCurrentView(id);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          {/* Logo */}
          <div className="nav-logo" onClick={() => go('home')} role="button" tabIndex={0} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src={logo} alt="OkaySpace Logo" style={{ height: '100px', margin: '-30px 0', mixBlendMode: 'multiply', objectFit: 'contain' }} />
          </div>

          {/* Desktop Links */}
          <div className="nav-links">
            {MODULES.map((m) => (
              <button
                key={m.id}
                className={`nav-link${currentView === m.id ? ' active' : ''}`}
                onClick={() => go(m.id)}
                id={`nav-${m.id}`}
              >
                <span>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => go('echo')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>✦</span> Open App
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="nav-drawer">
          {MODULES.map((m) => (
            <button
              key={m.id}
              className={`nav-link${currentView === m.id ? ' active' : ''}`}
              onClick={() => go(m.id)}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
