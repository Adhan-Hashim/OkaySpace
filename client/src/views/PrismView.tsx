import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import api from '../api';

const FACET_TYPES = [
  { key: 'evidence_for', label: 'Evidence For', icon: '✓', className: 'facet-evidence-for' },
  { key: 'evidence_against', label: 'Evidence Against', icon: '✗', className: 'facet-evidence-against' },
  { key: 'compassionate', label: 'Compassionate Reframe', icon: '💛', className: 'facet-compassionate' },
  { key: 'future_self', label: 'Future Self Perspective', icon: '🔭', className: 'facet-future-self' },
  { key: 'stoic', label: 'Stoic Perspective', icon: '🏛️', className: 'facet-stoic' },
  { key: 'reframe', label: 'Healthier Version', icon: '✨', className: 'facet-reframe' },
];

export default function PrismView() {
  const prismThought = useStore((s) => s.prismThought);
  const prismFacets = useStore((s) => s.prismFacets);
  const prismLoading = useStore((s) => s.prismLoading);
  const setPrismThought = useStore((s) => s.setPrismThought);
  const setPrismFacets = useStore((s) => s.setPrismFacets);
  const setPrismLoading = useStore((s) => s.setPrismLoading);
  const clearPrism = useStore((s) => s.clearPrism);
  const addNeuralNode = useStore((s) => s.addNeuralNode);
  const setEmotion = useStore((s) => s.setEmotion);
  const incrementInteraction = useStore((s) => s.incrementInteraction);

  const [input, setInput] = useState('');
  const [expandedFacet, setExpandedFacet] = useState(null);

  const submitThought = useCallback(async () => {
    const thought = input.trim();
    if (!thought || prismLoading) return;

    setPrismThought(thought);
    setPrismLoading(true);
    setInput('');
    incrementInteraction();

    try {
      const res = await api.post('/ai/prism', { thought });
      
      const data = res.data;
      setPrismFacets(data.facets || []);
    } catch {
      // Fallback facets
      setPrismFacets([
        {
          key: 'evidence_for',
          content: `There may be some truth to "${thought.slice(0, 50)}..." — our feelings are valid and arise from real experiences. The fact that you feel this way is real.`,
        },
        {
          key: 'evidence_against',
          content: 'Consider: has there been a time when you expected the worst and things turned out differently? Our minds often overestimate threats and underestimate our resilience.',
        },
        {
          key: 'compassionate',
          content: `If your dearest friend told you they were thinking "${thought.slice(0, 40)}...", you wouldn't agree — you'd remind them of their strength, their growth, and the many times they've overcome challenges.`,
        },
        {
          key: 'future_self',
          content: 'Your future self, looking back on this moment, might say: "I was going through something difficult, but I got through it. This chapter shaped me but didn\'t define me."',
        },
        {
          key: 'stoic',
          content: '"We suffer more in imagination than in reality." — Seneca. The Stoics remind us to separate what we can control from what we cannot, and to invest our energy accordingly.',
        },
        {
          key: 'reframe',
          content: `Instead of "${thought.slice(0, 40)}...", what if the truth is closer to: "I'm going through a challenging time, and it's okay to find this hard. I'm doing my best, and that's enough right now."`,
        },
      ]);
    }

    setPrismLoading(false);
    addNeuralNode({
      emotion: 'hope',
      text: thought.slice(0, 100),
      source: 'prism',
      intensity: 0.6,
    });
    setEmotion('hope', 0.6);
  }, [input, prismLoading, setPrismThought, setPrismFacets, setPrismLoading, addNeuralNode, setEmotion, incrementInteraction]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitThought();
    }
  };

  return (
    <div className="view-container prism-container" id="prism-view">
      {/* Header */}
      <motion.div
        className="view-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="heading-xl" id="prism-title">Prism</h1>
          <p className="text-caption" style={{ marginTop: '4px' }}>
            Thought Reframing Engine • AI-Powered Cognitive Restructuring
          </p>
        </div>
        {prismThought && (
          <button
            className="btn btn-ghost"
            onClick={clearPrism}
            id="prism-clear"
          >
            ↻ New Thought
          </button>
        )}
      </motion.div>

      {/* Content */}
      {!prismThought && !prismLoading ? (
        /* Input State */
        <div className="view-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', maxWidth: '500px' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
            <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>
              Drop a Thought
            </h2>
            <p className="text-body" style={{ marginBottom: '2rem' }}>
              Share a negative or distressing thought, and the Prism will refract it into
              multiple perspectives — each a different facet of truth.
            </p>
          </motion.div>

          <motion.div
            className="prism-input-area"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', width: '100%', maxWidth: '560px' }}
          >
            <textarea
              className="input-field"
              placeholder="What thought is weighing on you?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              id="prism-input"
              style={{ minHeight: '90px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', alignItems: 'center' }}>
              <span className="text-caption">Press Enter to refract</span>
              <button
                className="btn btn-primary"
                onClick={submitThought}
                disabled={!input.trim()}
                id="prism-submit"
              >
                🔮 Refract
              </button>
            </div>
          </motion.div>
        </div>
      ) : prismLoading ? (
        /* Loading State */
        <div className="view-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ fontSize: '4rem', display: 'inline-block' }}
            >
              🔮
            </motion.div>
            <p className="text-body" style={{ marginTop: '1rem' }}>
              Refracting your thought into facets...
            </p>
          </motion.div>
        </div>
      ) : (
        /* Facets Display */
        <div style={{ flex: 1, overflow: 'auto', paddingBottom: 'var(--space-xl)' }}>
          {/* Original Thought */}
          <motion.div
            className="prism-original-thought glass-subtle"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)', textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--space-xl)' }}
          >
            <div className="text-caption" style={{ marginBottom: '0.5rem' }}>Original Thought</div>
            <div className="heading-md" style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>"{prismThought}"</div>
          </motion.div>

          {/* Facet Grid */}
          <div className="prism-facets">
            <AnimatePresence>
              {FACET_TYPES.map((facetType, i) => {
                const facetData = prismFacets.find((f) => f.key === facetType.key);
                if (!facetData) return null;

                return (
                  <motion.div
                    key={facetType.key}
                    className={`facet-card glass ${facetType.className}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    onClick={() => setExpandedFacet(expandedFacet === facetType.key ? null : facetType.key)}
                    id={`facet-${facetType.key}`}
                  >
                    <div className="facet-icon">{facetType.icon}</div>
                    <div className="facet-type">{facetType.label}</div>
                    <div className="facet-content">
                      {expandedFacet === facetType.key
                        ? facetData.content
                        : facetData.content.slice(0, 120) + (facetData.content.length > 120 ? '...' : '')}
                    </div>
                    {facetData.content.length > 120 && (
                      <div className="text-caption" style={{ marginTop: '0.5rem' }}>
                        {expandedFacet === facetType.key ? 'Click to collapse' : 'Click to expand'}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
