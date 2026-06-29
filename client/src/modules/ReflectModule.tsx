import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ReflectModule({ onBack }) {
  const [entry, setEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('reflect_entries') || '[]');
    setEntries(saved);
  }, []);

  const handleReflect = async () => {
    if (!entry.trim()) return;
    setLoading(true);

    try {
      const res = await api.post('/ai/reflect', { text: entry });
      
      const newEntry = {
        id: Date.now(),
        text: entry,
        insight: res.data.insight,
        emotion: res.data.emotion,
        date: new Date().toISOString()
      };

      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem('reflect_entries', JSON.stringify(updated));
      setEntry(''); // Clear input
    } catch (err) {
      console.error(err);
      // Fallback
      const newEntry = {
        id: Date.now(),
        text: entry,
        insight: "Taking time to write down your thoughts is a powerful step. Acknowledge the feelings you've expressed here, and remember to be kind to yourself as you process them.",
        emotion: "Reflective",
        date: new Date().toISOString()
      };
      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem('reflect_entries', JSON.stringify(updated));
      setEntry('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-wrap">
      <div className="module-bg"></div>
      <button className="back-btn" onClick={onBack}>← Hub</button>

      <div className="module-content">
        <div className="reflect-card glass">
          <h2>Reflect</h2>
          <p>Write whatever is on your mind. Get gentle, AI-guided insight.</p>

          <textarea
            className="reflect-textarea"
            placeholder="I've been feeling..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />

          <button 
            className="reflect-btn" 
            onClick={handleReflect}
            disabled={!entry.trim() || loading}
          >
            {loading ? 'Reflecting...' : 'Save & Reflect'}
          </button>
        </div>

        {entries.length > 0 && (
          <div className="reflect-entries">
            <h3>Previous Entries</h3>
            {entries.map(e => (
              <div key={e.id} className="entry-item glass">
                <div className="entry-date">{new Date(e.date).toLocaleString()}</div>
                <div className="entry-preview">"{e.text}"</div>
                {e.insight && (
                  <div className="reflect-insight">
                    <span className="emotion-tag glass" style={{ color: 'var(--blue)' }}>{e.emotion}</span>
                    <div className="insight-text">{e.insight}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
