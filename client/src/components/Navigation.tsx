import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { AuthContext } from '../context/AuthContext';

const MODULES = [
  { id: 'echo', label: 'Echo' },
  { id: 'prism', label: 'Prism' },
  { id: 'resonance', label: 'Resonance' },
  { id: 'nexus', label: 'Nexus' },
];

export default function Navigation() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);
  const { user, logout } = useContext(AuthContext);

  const handleGoogleLogin = () => {
    // In development this points to localhost:5000/api, in prod it should point to Render URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Strip trailing /api if it exists to safely build the url
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');
    window.location.href = `${baseUrl}/api/auth/google`;
  };

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
      <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user.name}</span>
            <button 
              onClick={logout}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button 
            onClick={handleGoogleLogin}
            style={{
              marginLeft: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fff',
              color: '#000',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '16px', height: '16px' }} />
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
