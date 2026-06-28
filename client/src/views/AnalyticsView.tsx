import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsView() {
  const [data, setData] = useState({ timeline: [], distortions: {} });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/cbt/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        height: '100%',
        color: 'var(--text-primary)'
      }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>Emotional Analytics</h2>
      
      <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', height: '400px' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Mood Timeline (Entries over Time)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'white' }} />
            <Line type="monotone" dataKey="count" stroke="var(--primary-color)" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Cognitive Distortions Frequency</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {Object.entries(data.distortions).length === 0 ? (
             <p style={{ color: 'var(--text-secondary)' }}>No distortions recorded yet.</p>
          ) : (
            Object.entries(data.distortions).map(([distortion, count]) => (
              <div key={distortion} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', flex: '1 1 calc(33% - 1rem)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{String(count)}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{distortion}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
