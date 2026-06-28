import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const MODULES = [
  { id: 'echo', label: 'Echo' },
  { id: 'prism', label: 'Prism' },
  { id: 'resonance', label: 'Resonance' },
  { id: 'nexus', label: 'Nexus' },
];

export default function Navigation() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);

  return (
    <nav className="top-nav" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-md) var(--space-2xl)',
      width: '100%',
      zIndex: 100,
    }}>
      {/* Logo Area */}
      <div 
        className="nav-brand"
        onClick={() => setActiveView('home')}
        onKeyDown={(e) => e.key === 'Enter' && setActiveView('home')}
        role="button"
        tabIndex={0}
        aria-label="Go to Home page"
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '1.25rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          opacity: 0.9,
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        <span aria-hidden="true" style={{ fontSize: '1.5rem' }}>☁️</span>
        OkaySpace
      </div>

      {/* Center Links */}
      <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
        {MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveView(mod.id)}
            aria-label={`Open ${mod.label} module`}
            aria-current={activeView === mod.id ? 'page' : undefined}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              color: activeView === mod.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeView === mod.id ? 500 : 400,
              cursor: 'pointer',
              transition: 'color 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {mod.label}
          </button>
        ))}
      </div>

      {/* Right Icons */}
      <div className="nav-actions" style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setActiveView('cortex')}
          aria-label="Open Cortex Analytics"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            opacity: activeView === 'cortex' ? 1 : 0.7,
            transition: 'opacity 0.2s'
          }}
          title="Cortex Analytics"
        >
          <span aria-hidden="true">📊</span>
        </button>
        <button
          onClick={() => setActiveView('settings')}
          aria-label="Open Settings and Privacy"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            opacity: activeView === 'settings' ? 1 : 0.7,
            transition: 'opacity 0.2s'
          }}
          title="Settings & Privacy"
        >
          <span aria-hidden="true">⚙️</span>
        </button>
      </div>
    </nav>
  );
}
