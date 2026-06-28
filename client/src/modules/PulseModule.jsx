import React, { useState, useEffect } from 'react';

const MOODS = [
  { level: 5, label: 'Great', emoji: '✨' },
  { level: 4, label: 'Good', emoji: '😊' },
  { level: 3, label: 'Neutral', emoji: '😐' },
  { level: 2, label: 'Low', emoji: '😔' },
  { level: 1, label: 'Struggling', emoji: '🌧️' },
];

const MOOD_COLORS = {
  5: '#22c55e', // Green
  4: '#10b981', // Teal
  3: '#64748b', // Slate
  2: '#f59e0b', // Amber
  1: '#ef4444', // Red
};

export default function PulseModule({ onBack }) {
  const [entries, setEntries] = useState([]);
  const [todayEntry, setTodayEntry] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pulse_entries') || '[]');
    setEntries(saved);
    
    // Check if entered today
    const todayStr = new Date().toDateString();
    const found = saved.find(e => new Date(e.date).toDateString() === todayStr);
    if (found) setTodayEntry(found);
  }, []);

  const handleLogMood = (level) => {
    const newEntry = {
      id: Date.now(),
      level,
      date: new Date().toISOString()
    };
    
    // Replace today's entry if exists, else add
    const todayStr = new Date().toDateString();
    const filtered = entries.filter(e => new Date(e.date).toDateString() !== todayStr);
    const updated = [newEntry, ...filtered].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 30);
    
    setEntries(updated);
    setTodayEntry(newEntry);
    localStorage.setItem('pulse_entries', JSON.stringify(updated));
  };

  return (
    <div className="module-wrap">
      <div className="module-bg"></div>
      <button className="back-btn" onClick={onBack}>← Hub</button>

      <div className="module-content pulse-wrap">
        <h2 className="pulse-title">Pulse</h2>
        <p className="pulse-subtitle">How are you feeling today?</p>

        <div className="mood-grid">
          {MOODS.map(mood => {
            const isSelected = todayEntry?.level === mood.level;
            return (
              <div 
                key={mood.level}
                className={`glass mood-btn ${isSelected ? 'saved' : ''}`}
                onClick={() => handleLogMood(mood.level)}
                style={isSelected ? { borderColor: MOOD_COLORS[mood.level] } : {}}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label" style={{ color: isSelected ? MOOD_COLORS[mood.level] : 'var(--text-muted)' }}>
                  {mood.label}
                </span>
              </div>
            );
          })}
        </div>

        {entries.length > 0 && (
          <div className="pulse-history">
            <h3>Recent Pulse</h3>
            <div className="pulse-dots">
              {entries.map(entry => (
                <div 
                  key={entry.id} 
                  className="pulse-dot"
                  style={{ background: MOOD_COLORS[entry.level], opacity: 0.8 }}
                  title={`${new Date(entry.date).toLocaleDateString()} - Level ${entry.level}`}
                >
                  <div className="pulse-dot-date">
                    {new Date(entry.date).getDate()}/{new Date(entry.date).getMonth()+1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
