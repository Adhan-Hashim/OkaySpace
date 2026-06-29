import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import api from '../api';
import bgLake from '../assets/bg-lake.png';

const FACET_TYPES = [
  { key: 'evidence_for',      label: 'Evidence For',             icon: '✓', className: 'facet-evidence-for',    color: '#68D391', bg: '#F0FFF4' },
  { key: 'evidence_against',  label: 'Evidence Against',         icon: '✗', className: 'facet-evidence-against', color: '#F6AD55', bg: '#FFFAF0' },
  { key: 'compassionate',     label: 'Compassionate Reframe',    icon: '💛', className: 'facet-compassionate',   color: '#F6E05E', bg: '#FFFFF0' },
  { key: 'future_self',       label: 'Future Self Perspective',  icon: '🔭', className: 'facet-future-self',     color: '#76E4F7', bg: '#E8FCFF' },
  { key: 'stoic',             label: 'Stoic Perspective',        icon: '🏛️', className: 'facet-stoic',           color: '#B794F4', bg: '#FAF5FF' },
  { key: 'reframe',           label: 'Healthier Version',        icon: '✨', className: 'facet-reframe',         color: '#7FB69D', bg: '#F0F7F4' },
];

// Crystal prism SVG illustration
function PrismIllustration() {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 160, height: 160 }}>
      {/* Glow */}
      <circle cx="80" cy="80" r="68" fill="url(#glow)" opacity="0.25"/>
      {/* Crystal body */}
      <polygon points="80,18 125,90 35,90" fill="url(#crystal)" opacity="0.9"/>
      <polygon points="80,18 125,90 80,142 35,90" fill="url(#crystal2)" opacity="0.85"/>
      {/* Light rays */}
      <line x1="125" y1="90" x2="155" y2="75"  stroke="#68D391" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
      <line x1="125" y1="90" x2="158" y2="95"  stroke="#76E4F7" strokeWidth="2"   opacity="0.6" strokeLinecap="round"/>
      <line x1="125" y1="90" x2="152" y2="112" stroke="#B794F4" strokeWidth="2"   opacity="0.6" strokeLinecap="round"/>
      <line x1="125" y1="90" x2="148" y2="128" stroke="#F6AD55" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
      <line x1="125" y1="90" x2="140" y2="142" stroke="#F687B3" strokeWidth="1.5" opacity="0.45" strokeLinecap="round"/>
      {/* Sparkles */}
      <circle cx="48"  cy="40" r="3"   fill="#A8DADC" opacity="0.7"/>
      <circle cx="118" cy="50" r="2"   fill="#7FB69D" opacity="0.6"/>
      <circle cx="30"  cy="105" r="2.5" fill="#B794F4" opacity="0.5"/>
      <circle cx="140" cy="60" r="2"   fill="#76E4F7" opacity="0.6"/>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#A8DADC"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="crystal" x1="80" y1="18" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8F7F8"/>
          <stop offset="100%" stopColor="#A8DADC" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="crystal2" x1="80" y1="18" x2="80" y2="142" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C8ECEE" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#7FB69D" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function PrismView() {
  const prismThought   = useStore((s) => s.prismThought);
  const prismFacets    = useStore((s) => s.prismFacets);
  const prismLoading   = useStore((s) => s.prismLoading);
  const setPrismThought  = useStore((s) => s.setPrismThought);
  const setPrismFacets   = useStore((s) => s.setPrismFacets);
  const setPrismLoading  = useStore((s) => s.setPrismLoading);
  const clearPrism       = useStore((s) => s.clearPrism);
  const addNeuralNode    = useStore((s) => s.addNeuralNode);
  const setEmotion       = useStore((s) => s.setEmotion);
  const incrementInteraction = useStore((s) => s.incrementInteraction);

  const [input, setInput] = useState('');
  const [expandedFacet, setExpandedFacet] = useState<string | null>(null);

  const submitThought = useCallback(async () => {
    const thought = input.trim();
    if (!thought || prismLoading) return;
    setPrismThought(thought);
    setPrismLoading(true);
    setInput('');
    incrementInteraction();

    try {
      const res = await api.post('/ai/prism', { thought });
      setPrismFacets(res.data.facets || []);
    } catch {
      setPrismFacets([
        { key: 'evidence_for',     content: `There may be some truth to "${thought.slice(0, 50)}..." — our feelings are valid and arise from real experiences. The fact that you feel this way is real.` },
        { key: 'evidence_against', content: 'Has there been a time when you expected the worst and things turned out differently? Our minds often overestimate threats and underestimate our resilience.' },
        { key: 'compassionate',    content: `If your dearest friend told you they were thinking "${thought.slice(0, 40)}...", you'd remind them of their strength and the many times they've overcome challenges.` },
        { key: 'future_self',      content: 'Your future self, looking back, might say: "I was going through something difficult, but I got through it. This chapter shaped me but didn\'t define me."' },
        { key: 'stoic',            content: '"We suffer more in imagination than in reality." — Seneca. The Stoics remind us to separate what we can control from what we cannot.' },
        { key: 'reframe',          content: `Instead of "${thought.slice(0, 40)}...", what if: "I'm going through a challenging time, and it's okay to find this hard. I'm doing my best, and that's enough right now."` },
      ]);
    }

    setPrismLoading(false);
    addNeuralNode({ emotion: 'hope', text: thought.slice(0, 100), source: 'prism', intensity: 0.6 });
    setEmotion('hope', 0.6);
  }, [input, prismLoading, setPrismThought, setPrismFacets, setPrismLoading, addNeuralNode, setEmotion, incrementInteraction]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitThought(); }
  };

  return (
    <motion.div
      className="prism-page-nature"
      id="prism-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45 }}
      style={{
        backgroundImage: `url(${bgLake})`,
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

      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>

      {/* Header */}
      <div className="view-header" style={{ background: 'rgba(255,255,255,0.4)', padding: 'var(--sp-4)', borderRadius: 'var(--r-xl)', marginBottom: 'var(--sp-6)' }}>
        <div className="view-header-left">
          <div className="view-eyebrow" style={{ color: 'var(--primary-dark)' }}>🔮 &nbsp;Thought Work</div>
          <h1 className="view-title t-organic" id="prism-title" style={{ color: 'var(--primary-dark)' }}>Prism</h1>
          <p className="view-subtitle" style={{ color: 'var(--primary-dark)' }}>Refract a difficult thought through six healing perspectives</p>
        </div>
        {prismThought && (
          <button className="btn btn-primary" onClick={clearPrism} id="prism-clear">
            ↻ &nbsp;New Thought
          </button>
        )}
      </div>

      {/* States */}
      <AnimatePresence mode="wait">

        {/* ── INPUT STATE ── */}
        {!prismThought && !prismLoading && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 'var(--sp-8)', padding: 'var(--sp-6) 0' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-5)', textAlign: 'center' }}>
              <PrismIllustration />
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: 'var(--sp-3)', color: 'var(--primary-dark)' }}>
                  Drop a thought into the Prism
                </h2>
                <p style={{ color: 'var(--primary-dark)', maxWidth: '460px', lineHeight: 1.7, fontSize: '1rem' }}>
                  Share a negative or distressing thought. The Prism will refract it through six therapeutic lenses — each revealing a different facet of truth.
                </p>
              </div>
            </div>

            <div className="prism-input-card glass-panel" style={{ padding: 'var(--sp-8)' }}>
              <div className="t-label" style={{ marginBottom: 'var(--sp-2)' }}>Your thought</div>
              <textarea
                className="input"
                placeholder="What thought is weighing on you?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                id="prism-input"
                style={{ fontSize: '1.05rem', lineHeight: 1.65 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--sp-2)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enter to refract · Shift+Enter for new line</span>
                <button
                  className="btn btn-primary"
                  onClick={submitThought}
                  disabled={!input.trim()}
                  id="prism-submit"
                >
                  🔮 &nbsp;Refract
                </button>
              </div>
            </div>

            {/* How it works mini */}
            <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '600px' }}>
              {FACET_TYPES.map((f) => (
                <div key={f.key} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                  padding: 'var(--sp-2) var(--sp-3)',
                  background: f.bg, borderRadius: 'var(--r-full)',
                  fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)',
                  border: '1px solid var(--border-light)',
                }}>
                  <span>{f.icon}</span>{f.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── LOADING STATE ── */}
        {prismLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-6)', textAlign: 'center' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <PrismIllustration />
            </motion.div>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--text)', marginBottom: 'var(--sp-2)' }}>
                Refracting your thought...
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Examining through six therapeutic lenses
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <motion.div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, delay: d, repeat: Infinity }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── FACETS STATE ── */}
        {prismThought && !prismLoading && (
          <motion.div
            key="facets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1, overflow: 'auto', paddingBottom: 'var(--sp-10)' }}
          >
            {/* Original thought banner */}
            <div className="prism-original glass-panel" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
              <div className="t-label" style={{ marginBottom: 'var(--sp-2)' }}>Your original thought</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--primary-dark)' }}>
                "{prismThought}"
              </div>
            </div>

            {/* Facet cards */}
            <div className="prism-facets-grid">
              <AnimatePresence>
                {FACET_TYPES.map((facetType, i) => {
                  const facetData = prismFacets.find((f) => f.key === facetType.key);
                  if (!facetData) return null;
                  const isExpanded = expandedFacet === facetType.key;

                  return (
                    <motion.div
                      key={facetType.key}
                      className={`facet-card glass-panel ${facetType.className}`}
                      initial={{ opacity: 0, y: 24, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
                      onClick={() => setExpandedFacet(isExpanded ? null : facetType.key)}
                      id={`facet-${facetType.key}`}
                      style={{ background: isExpanded ? `rgba(255,255,255,0.7)` : 'rgba(255,255,255,0.4)', padding: 'var(--sp-6)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div className="facet-icon-wrap" style={{ background: facetType.bg }}>
                          <span style={{ fontSize: '1.1rem' }}>{facetType.icon}</span>
                        </div>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: facetType.color, marginTop: '4px', flexShrink: 0 }} />
                      </div>
                      <div className="facet-label">{facetType.label}</div>
                      <div className="facet-body">
                        {isExpanded ? facetData.content : facetData.content.slice(0, 110) + (facetData.content.length > 110 ? '...' : '')}
                      </div>
                      {facetData.content.length > 110 && (
                        <div className="facet-expand">
                          {isExpanded ? '↑ Collapse' : '↓ Read more'}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Action footer */}
            <div style={{ display: 'flex', gap: 'var(--sp-4)', marginTop: 'var(--sp-8)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={clearPrism}>🔮 Try Another Thought</button>
              <button className="btn btn-secondary">💬 Continue in Echo</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
}
