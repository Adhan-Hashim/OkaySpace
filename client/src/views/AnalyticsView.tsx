import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import api from '../api';
import bgHome from '../assets/bg-home.png';

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.08 },
});

const STAT_CARDS = [
  { icon: '', label: 'Echo Sessions',   key: 'echoSessions',   fallback: 0,   unit: '',  change: '+2 this week' },
  { icon: '', label: 'Thoughts Reframed', key: 'prismCount',   fallback: 0,   unit: '',  change: '+1 today' },
  { icon: '', label: 'Breath Sessions', key: 'breathCount',    fallback: 0,   unit: '',  change: 'Keep going!' },
  { icon: '', label: 'Nexus Connects',  key: 'nexusCount',     fallback: 0,   unit: '',  change: 'Stay connected' },
];

// Custom chart tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', fontSize: '0.82rem' }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '1rem' }}>{payload[0].value} entries</div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsView() {
  const [data, setData] = useState<{ timeline: any[]; distortions: Record<string, number> }>({ timeline: [], distortions: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/cbt/analytics');
        setData(res.data);
      } catch {
        // Demo data if API unavailable
        setData({
          timeline: [
            { date: 'Mon', count: 2 }, { date: 'Tue', count: 4 }, { date: 'Wed', count: 3 },
            { date: 'Thu', count: 6 }, { date: 'Fri', count: 5 }, { date: 'Sat', count: 7 }, { date: 'Sun', count: 4 },
          ],
          distortions: { 'All-or-Nothing': 3, 'Catastrophizing': 2, 'Mind Reading': 1, 'Overgeneralization': 2 },
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <motion.div
      className="analytics-page-nature vd-page-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45 }}
      style={{
        backgroundImage: `url(${bgHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'calc(-1 * var(--nav-h))',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(248, 250, 248, 0.4)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>

      {/* Header */}
      <div className="view-header" style={{ background: 'rgba(255,255,255,0.4)', padding: 'var(--sp-4)', borderRadius: 'var(--r-xl)', marginBottom: 'var(--sp-6)' }}>
        <div className="view-header-left">
          <div className="view-eyebrow" style={{ color: 'var(--primary-dark)' }}> &nbsp;Insights</div>
          <h1 className="view-title t-organic" style={{ color: 'var(--primary-dark)' }}>Your Wellness Story</h1>
          <p className="view-subtitle" style={{ color: 'var(--primary-dark)' }}>Patterns, progress, and emotional insights over time</p>
        </div>
        <button className="btn btn-secondary btn-sm">
          ↓ Export Data
        </button>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {STAT_CARDS.map((s, i) => (
          <motion.div key={s.key} className="stat-card glass-panel" {...stagger(i)} style={{ padding: 'var(--sp-5)' }}>
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-val" style={{ color: 'var(--primary-dark)' }}>
              {loading ? (
                <div className="skeleton" style={{ width: 60, height: 36, display: 'inline-block' }} />
              ) : (
                (data as any)[s.key] ?? s.fallback
              )}
            </div>
            <div className="stat-label" style={{ color: 'var(--primary-dark)' }}>{s.label}</div>
            <div className="stat-change" style={{ color: 'var(--primary-dark)' }}>{s.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Mood timeline chart */}
      <motion.div className="chart-card glass-panel" {...stagger(1)} style={{ padding: 'var(--sp-6)', marginTop: 'var(--sp-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-6)' }}>
          <div>
            <div className="t-label" style={{ marginBottom: 'var(--sp-1)', color: 'var(--primary-dark)' }}>Mood Timeline</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--primary-dark)' }}>Entries over time</h3>
          </div>
          <div className="pill pill-green">Last 7 days</div>
        </div>

        {data.timeline.length === 0 && !loading ? (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <span style={{ fontSize: '2rem' }}></span>
            <span>Start using Echo or Prism to see your emotional timeline</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.timeline} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7FB69D" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#7FB69D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="var(--border-light)" vertical={false}/>
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false}/>
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Area type="monotone" dataKey="count" stroke="#7FB69D" strokeWidth={2.5} fill="url(#chartGrad)" dot={{ fill: '#7FB69D', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#5FA8A5' }}/>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Cognitive distortions */}
      <motion.div className="chart-card glass-panel" {...stagger(2)} style={{ padding: 'var(--sp-6)', marginTop: 'var(--sp-6)' }}>
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <div className="t-label" style={{ marginBottom: 'var(--sp-1)', color: 'var(--primary-dark)' }}>Cognitive Distortions</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--primary-dark)' }}>Patterns identified by Echo</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
            Recognizing these patterns is the first step to overcoming them through CBT.
          </p>
        </div>

        {Object.entries(data.distortions).length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100, color: 'var(--text-muted)', fontSize: '0.9rem', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <span style={{ fontSize: '2rem' }}></span>
            <span>Use Echo's Reframe Mode to identify cognitive distortions</span>
          </div>
        ) : (
          <div className="distortion-chips">
            {Object.entries(data.distortions).map(([name, count], i) => (
              <motion.div key={name} className="distortion-chip" {...stagger(i)}>
                <div className="distortion-chip-count">{String(count)}</div>
                <div className="distortion-chip-name">{name}</div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tips card */}
      <motion.div className="glass-panel" {...stagger(3)} style={{
        marginTop: 'var(--sp-6)',
        borderRadius: 'var(--r-xl)', padding: 'var(--sp-8)',
        display: 'flex', gap: 'var(--sp-6)', alignItems: 'flex-start',
      }}>
        <div style={{ fontSize: '2rem', flexShrink: 0 }}></div>
        <div>
          <div className="t-label" style={{ marginBottom: 'var(--sp-2)', color: 'var(--primary-dark)' }}>
            Your growth tip
          </div>
          <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: 'var(--sp-2)' }}>
            Consistency is the key to lasting change
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.7 }}>
            Research shows that just 10 minutes of daily mindfulness practice over 8 weeks measurably reduces amygdala reactivity and cortisol levels. Keep showing up for yourself — every session counts.
          </p>
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
}
