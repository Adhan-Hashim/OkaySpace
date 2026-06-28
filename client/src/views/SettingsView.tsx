import React from 'react';
import { motion } from 'framer-motion';

export default function SettingsView() {
  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/ai/export', { // Note: Auth routes might be under a different path, e.g. /api/auth/export
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'okayspace-export.json';
        a.click();
      }
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure? This will permanently delete your account and all data. This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/ai/delete', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          localStorage.removeItem('token');
          window.location.reload();
        }
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>Settings & Privacy</h2>
      
      <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Data Portability</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Download a complete copy of your emotional data, CBT entries, and account information. 
          You can share this JSON file securely with your therapist.
        </p>
        <button 
          onClick={handleExport}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Export My Data
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid #ff444433' }}>
        <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Danger Zone</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Permanently delete your account and all associated data. This action cannot be reversed.
        </p>
        <button 
          onClick={handleDelete}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: '#ff4444',
            border: '1px solid #ff4444',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Nuke My Data
        </button>
      </div>
    </motion.div>
  );
}
