import React, { useState } from 'react';
import useStore from '../store/useStore';

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
          <div className="nav-logo" onClick={() => go('home')} role="button" tabIndex={0}>
            <div className="nav-logo-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="4" fill="white" opacity="0.9"/>
                <path d="M10 2 Q14 6 10 10 Q6 6 10 2Z" fill="white" opacity="0.6"/>
                <path d="M18 10 Q14 14 10 10 Q14 6 18 10Z" fill="white" opacity="0.6"/>
                <path d="M10 18 Q6 14 10 10 Q14 14 10 18Z" fill="white" opacity="0.6"/>
                <path d="M2 10 Q6 6 10 10 Q6 14 2 10Z" fill="white" opacity="0.6"/>
              </svg>
            </div>
            <span className="nav-logo-text">OkaySpace</span>
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
