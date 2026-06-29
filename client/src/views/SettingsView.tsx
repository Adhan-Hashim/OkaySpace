import React from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import bgForest from '../assets/bg-forest.png';

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.1 },
});

export default function SettingsView() {
  const handleExport = async () => {
    try {
      const res = await api.get('/auth/export');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'okayspace-export.json'; a.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure? This will permanently delete your account and all data. This cannot be undone.')) {
      try {
        const res = await api.delete('/auth/delete');
        if (res.status === 200) { localStorage.removeItem('token'); window.location.reload(); }
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  return (
    <motion.div
      className="settings-page-nature"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45 }}
      style={{
        backgroundImage: `url(${bgForest})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'calc(-1 * var(--nav-h))',
        paddingTop: 'calc(var(--nav-h) + var(--sp-6))',
        paddingLeft: 'var(--sp-8)',
        paddingRight: 'var(--sp-8)',
        paddingBottom: 'var(--sp-6)',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(248, 250, 248, 0.4)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>

      {/* Header */}
      <div className="view-header" style={{ marginBottom: 'var(--sp-6)', background: 'rgba(255,255,255,0.4)', padding: 'var(--sp-4)', borderRadius: 'var(--r-xl)' }}>
        <div className="view-header-left">
          <div className="view-eyebrow" style={{ color: 'var(--primary-dark)' }}> &nbsp;Settings</div>
          <h1 className="view-title t-organic" style={{ color: 'var(--primary-dark)' }}>Settings & Privacy</h1>
          <p className="view-subtitle" style={{ color: 'var(--primary-dark)' }}>Your data, your rules. Always.</p>
        </div>
      </div>

      {/* Privacy promise */}
      <motion.div className="glass-panel" {...stagger(0)} style={{
        borderRadius: 'var(--r-xl)', padding: 'var(--sp-6) var(--sp-8)',
        display: 'flex', gap: 'var(--sp-5)', alignItems: 'center', marginBottom: 'var(--sp-6)'
      }}>
        <div style={{ fontSize: '2.2rem', flexShrink: 0 }}></div>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: 'var(--sp-1)' }}>
            Privacy-first by design
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.7 }}>
            OkaySpace never sells your data. Your emotional entries, conversations, and sessions are yours. 
            Nexus chats are never stored. You can export or delete everything at any time.
          </p>
        </div>
      </motion.div>

      {/* Data Portability */}
      <motion.div className="settings-card glass-panel" {...stagger(1)} style={{ marginBottom: 'var(--sp-6)' }}>
        <div className="settings-card-header" style={{ padding: 'var(--sp-5)', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
          <div className="settings-card-icon"></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>Data Portability</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-dark)' }}>Download a copy of your data</div>
          </div>
        </div>
        <div className="settings-card-body" style={{ padding: 'var(--sp-5)' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--primary-dark)', lineHeight: 1.7, marginBottom: 'var(--sp-4)' }}>
            Download a complete copy of your emotional data, CBT entries, session history, and account information as a JSON file.
            You can share this securely with your therapist or keep it as a personal record.
          </p>
          <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleExport}>
              ↓ &nbsp;Export My Data
            </button>
            <div className="pill pill-green">JSON format</div>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div className="settings-card glass-panel" {...stagger(2)} style={{ marginBottom: 'var(--sp-6)' }}>
        <div className="settings-card-header" style={{ padding: 'var(--sp-5)', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
          <div className="settings-card-icon"></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>Preferences</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-dark)' }}>Customize your experience</div>
          </div>
        </div>
        <div className="settings-card-body" style={{ padding: 'var(--sp-5)' }}>
          {[
            { label: 'Reduce motion animations', desc: 'Uses your system preference automatically via CSS media query', toggled: false },
            { label: 'Enable sound by default', desc: 'Start meditation sessions with ambient sound enabled', toggled: false },
            { label: 'Session reminders', desc: 'Gentle browser notifications for daily check-ins', toggled: false },
          ].map((pref, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--sp-4) 0',
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.4)' : 'none',
              gap: 'var(--sp-4)',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary-dark)' }}>{pref.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-dark)', marginTop: 2 }}>{pref.desc}</div>
              </div>
              {/* Toggle pill */}
              <div style={{
                width: 42, height: 24, borderRadius: 'var(--r-full)',
                background: pref.toggled ? 'var(--primary)' : 'var(--border)',
                cursor: 'pointer', position: 'relative', flexShrink: 0,
                transition: 'background 0.2s ease',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: 'white',
                  position: 'absolute', top: 3, left: pref.toggled ? 21 : 3,
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* About */}
      <motion.div className="settings-card glass-panel" {...stagger(3)} style={{ marginBottom: 'var(--sp-6)' }}>
        <div className="settings-card-header" style={{ padding: 'var(--sp-5)', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
          <div className="settings-card-icon"></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>About OkaySpace</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-dark)' }}>Version & credits</div>
          </div>
        </div>
        <div className="settings-card-body" style={{ padding: 'var(--sp-5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {[
              { label: 'Version', value: '2.0.0' },
              { label: 'License', value: 'MIT Open Source' },
              { label: 'Built with', value: 'React · Node.js · Socket.IO · Gemini AI' },
              { label: 'Therapeutic approach', value: 'CBT · DBT · Mindfulness · ACT' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', gap: 'var(--sp-4)' }}>
                <span style={{ color: 'var(--primary-dark)', fontWeight: 500 }}>{item.label}</span>
                <span style={{ color: 'var(--primary-dark)', fontWeight: 600, textAlign: 'right' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-4)', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--r-lg)', fontSize: '0.8rem', color: 'var(--primary-dark)', lineHeight: 1.7 }}>
             OkaySpace is a wellness support tool, not a replacement for professional mental health care. If you're in crisis, please reach out to a qualified mental health professional.
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div className="settings-card glass-panel" {...stagger(4)}>
        <div className="settings-card-header" style={{ padding: 'var(--sp-5)', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
          <div className="settings-card-icon" style={{ background: 'rgba(229,115,115,0.12)' }}></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--danger)' }}>Danger Zone</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-dark)' }}>Irreversible actions</div>
          </div>
        </div>
        <div className="settings-card-body" style={{ padding: 'var(--sp-5)' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--primary-dark)', lineHeight: 1.7, marginBottom: 'var(--sp-4)' }}>
            Permanently delete your account and all associated data — conversations, sessions, analytics, and profile. 
            This action is <strong>immediate and irreversible.</strong> We cannot recover your data after deletion.
          </p>
          <button className="btn btn-danger" onClick={handleDelete}>
             &nbsp;Permanently Delete My Account
          </button>
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
}
