import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import useStore, { EMOTION_COLORS, EMOTION_LABELS } from '../store/useStore';

export default function CortexView() {
  const neuralNodes = useStore((s) => s.neuralNodes);
  const interactionCount = useStore((s) => s.interactionCount);
  const sessionStart = useStore((s) => s.sessionStart);
  const echoMessages = useStore((s) => s.echoMessages);

  const analytics = useMemo(() => {
    const emotionCounts = {};
    const sourceCounts = {};

    neuralNodes.forEach((node) => {
      emotionCounts[node.emotion] = (emotionCounts[node.emotion] || 0) + 1;
      sourceCounts[node.source] = (sourceCounts[node.source] || 0) + 1;
    });

    // Dominant emotion
    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';

    // Most used module
    const mostUsedModule = Object.entries(sourceCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'none';

    // Average intensity
    const avgIntensity = neuralNodes.length > 0
      ? neuralNodes.reduce((sum, n) => sum + (n.intensity || 0.5), 0) / neuralNodes.length
      : 0;

    // Session duration
    const sessionMinutes = Math.round(
      (Date.now() - new Date(sessionStart).getTime()) / 60000
    );

    // Emotion timeline (last 20 nodes)
    const timeline = neuralNodes.slice(-30).map((node) => ({
      emotion: node.emotion,
      color: EMOTION_COLORS[node.emotion] || '#b388ff',
      intensity: node.intensity || 0.5,
    }));

    // Insights
    const insights = [];

    if (neuralNodes.length >= 3) {
      const recentEmotions = neuralNodes.slice(-5).map((n) => n.emotion);
      const calmCount = recentEmotions.filter((e) => ['calm', 'peace', 'joy', 'hope', 'gratitude'].includes(e)).length;
      if (calmCount >= 3) {
        insights.push({
          icon: '🌟',
          text: 'Your recent emotional trajectory shows a positive trend. Keep nurturing these states.',
          type: 'positive',
        });
      }

      const anxietyCount = (emotionCounts.anxiety || 0) + (emotionCounts.anger || 0);
      if (anxietyCount > neuralNodes.length * 0.4) {
        insights.push({
          icon: '🫁',
          text: 'High stress patterns detected. Consider a Resonance breathing session to activate your parasympathetic nervous system.',
          type: 'suggestion',
        });
      }
    }

    if (sourceCounts.echo > 3) {
      insights.push({
        icon: '🤖',
        text: `You've had ${sourceCounts.echo} conversations with Echo. Regular reflection builds emotional intelligence.`,
        type: 'info',
      });
    }

    if (sourceCounts.prism > 0) {
      insights.push({
        icon: '🔮',
        text: `${sourceCounts.prism} thoughts refracted through the Prism. Cognitive reframing is one of the most effective CBT techniques.`,
        type: 'info',
      });
    }

    if (sourceCounts.resonance > 0) {
      insights.push({
        icon: '🫁',
        text: `${sourceCounts.resonance} breathing sessions completed. Consistent practice increases heart rate variability and resilience.`,
        type: 'positive',
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '✨',
        text: 'Start exploring the modules to build your neural map. Each interaction adds a new data point to your emotional constellation.',
        type: 'info',
      });
    }

    return {
      totalNodes: neuralNodes.length,
      dominantEmotion,
      mostUsedModule,
      avgIntensity,
      sessionMinutes,
      emotionCounts,
      timeline,
      insights,
      echoCount: echoMessages.filter((m) => m.role === 'user').length,
    };
  }, [neuralNodes, interactionCount, sessionStart, echoMessages]);

  const emotionEntries = Object.entries(analytics.emotionCounts)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="view-container cortex-container" id="cortex-view">
      {/* Header */}
      <motion.div
        className="view-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ flexShrink: 0 }}
      >
        <div>
          <h1 className="heading-xl" id="cortex-title">Cortex</h1>
          <p className="text-caption" style={{ marginTop: '4px' }}>
            Emotional Intelligence Dashboard • Session Analytics
          </p>
        </div>
        <div className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Session: {analytics.sessionMinutes}m
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="cortex-grid"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="cortex-stat-card glass-subtle">
          <span className="stat-label">Neural Nodes</span>
          <span className="stat-value" style={{ color: 'var(--primary)' }}>
            {analytics.totalNodes}
          </span>
          <span className="stat-change positive">
            {analytics.totalNodes > 0 ? `+${analytics.totalNodes} this session` : 'Start exploring'}
          </span>
        </div>

        <div className="cortex-stat-card glass-subtle">
          <span className="stat-label">Dominant Emotion</span>
          <span className="stat-value" style={{ color: EMOTION_COLORS[analytics.dominantEmotion] }}>
            {EMOTION_LABELS[analytics.dominantEmotion]}
          </span>
          <span className="stat-change">
            {analytics.emotionCounts[analytics.dominantEmotion] || 0} occurrences
          </span>
        </div>

        <div className="cortex-stat-card glass-subtle">
          <span className="stat-label">Interactions</span>
          <span className="stat-value" style={{ color: 'var(--accent)' }}>
            {interactionCount}
          </span>
          <span className="stat-change positive">
            {analytics.echoCount > 0 ? `${analytics.echoCount} Echo messages` : 'Across all modules'}
          </span>
        </div>
      </motion.div>

      {/* Emotion Timeline */}
      <motion.div
        className="cortex-timeline glass-subtle"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="heading-sm" style={{ marginBottom: '1rem' }}>Emotion Timeline</h3>
        {analytics.timeline.length > 0 ? (
          <div className="timeline-bar">
            {analytics.timeline.map((entry, i) => (
              <motion.div
                key={i}
                className="timeline-bar-item"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(entry.intensity * 100, 15)}%` }}
                transition={{ delay: 0.3 + i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: entry.color }}
                title={`${EMOTION_LABELS[entry.emotion]} (${Math.round(entry.intensity * 100)}%)`}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-ghost)' }}>
            <p className="text-body">No data yet. Interact with Echo, Prism, or Resonance to build your timeline.</p>
          </div>
        )}
      </motion.div>

      {/* Emotion Breakdown */}
      {emotionEntries.length > 0 && (
        <motion.div
          className="glass-subtle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ padding: 'var(--space-lg)' }}
        >
          <h3 className="heading-sm" style={{ marginBottom: '1rem' }}>Emotion Spectrum</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {emotionEntries.map(([emotion, count]) => {
              const percentage = (count / analytics.totalNodes) * 100;
              return (
                <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: EMOTION_COLORS[emotion],
                    boxShadow: `0 0 8px ${EMOTION_COLORS[emotion]}60`,
                    flexShrink: 0,
                  }} />
                  <span style={{ width: '80px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {EMOTION_LABELS[emotion]}
                  </span>
                  <div style={{ flex: 1, height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        height: '100%',
                        background: EMOTION_COLORS[emotion],
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                  <span className="text-mono" style={{ width: '40px', textAlign: 'right', fontSize: '0.75rem' }}>
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      <motion.div
        className="cortex-insights"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="heading-sm">Neural Insights</h3>
        {analytics.insights.map((insight, i) => (
          <motion.div
            key={i}
            className="cortex-insight glass-subtle"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <span className="insight-icon">{insight.icon}</span>
            <span className="insight-text">{insight.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
