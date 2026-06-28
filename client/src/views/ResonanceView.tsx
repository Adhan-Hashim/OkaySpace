import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const BREATHING_PATTERNS = {
  box: {
    name: 'Box Breathing',
    description: 'Military-grade calm',
    phases: [
      { name: 'Inhale', duration: 4, className: 'inhale' },
      { name: 'Hold', duration: 4, className: 'hold' },
      { name: 'Exhale', duration: 4, className: 'exhale' },
      { name: 'Hold', duration: 4, className: 'hold' },
    ],
    color: '#a3c9e2', // soft blue
  },
  relaxing: {
    name: '4-7-8 Relaxing',
    description: 'Deep relaxation',
    phases: [
      { name: 'Inhale', duration: 4, className: 'inhale' },
      { name: 'Hold', duration: 7, className: 'hold' },
      { name: 'Exhale', duration: 8, className: 'exhale' },
    ],
    color: '#b2f7ef', // soft cyan
  },
  coherent: {
    name: 'Coherent',
    description: 'Heart-brain sync',
    phases: [
      { name: 'Inhale', duration: 5, className: 'inhale' },
      { name: 'Exhale', duration: 5, className: 'exhale' },
    ],
    color: '#c8b6ff', // soft purple
  },
  energizing: {
    name: 'Energizing',
    description: 'Rapid activation',
    phases: [
      { name: 'Inhale', duration: 2, className: 'inhale' },
      { name: 'Exhale', duration: 2, className: 'exhale' },
    ],
    color: '#fdf0d5', // soft yellow
  },
  calming: {
    name: 'Extended Exhale',
    description: 'Vagus nerve activation',
    phases: [
      { name: 'Inhale', duration: 4, className: 'inhale' },
      { name: 'Exhale', duration: 8, className: 'exhale' },
    ],
    color: '#ffb5a7', // light pink
  },
};

// Web Audio API generative tones
function createAudioContext() {
  try {
    return new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(audioCtx, frequency, duration, volume = 0.05) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.5);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

export default function ResonanceView() {
  const breathingPattern = useStore((s) => s.breathingPattern);
  const setBreathingPattern = useStore((s) => s.setBreathingPattern);
  const setBreathingActive = useStore((s) => s.setBreathingActive);
  const addNeuralNode = useStore((s) => s.addNeuralNode);
  const setEmotion = useStore((s) => s.setEmotion);

  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  const pattern = BREATHING_PATTERNS[breathingPattern];
  const phase = pattern.phases[phaseIndex];

  const start = useCallback(() => {
    setRunning(true);
    setBreathingActive(true);
    setPhaseIndex(0);
    setCountdown(pattern.phases[0].duration);
    setCycles(0);

    if (soundEnabled && !audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
  }, [pattern, soundEnabled, setBreathingActive]);

  const stop = useCallback(() => {
    setRunning(false);
    setBreathingActive(false);
    setPhaseIndex(0);
    setCountdown(pattern.phases[0].duration);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (cycles > 0) {
      addNeuralNode({
        emotion: 'calm',
        text: `${pattern.name} breathing — ${cycles} cycles`,
        source: 'resonance',
        intensity: Math.min(0.3 + cycles * 0.1, 1),
      });
      setEmotion('calm', 0.7);
    }
  }, [pattern, cycles, addNeuralNode, setEmotion, setBreathingActive]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => {
            const next = (pi + 1) % pattern.phases.length;
            if (next === 0) setCycles((c) => c + 1);

            // Play tone on phase change
            if (soundEnabled && audioCtxRef.current) {
              const freq = pattern.phases[next].className === 'inhale' ? 396 :
                pattern.phases[next].className === 'hold' ? 528 : 639;
              playTone(audioCtxRef.current, freq, pattern.phases[next].duration, 0.03);
            }

            return next;
          });
          return pattern.phases[(phaseIndex + 1) % pattern.phases.length].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, phaseIndex, pattern, soundEnabled]);

  // Nebula colors based on phase
  const nebulaStyle = useMemo(() => {
    if (!running) {
      return {
        background: `radial-gradient(circle, ${pattern.color}15 0%, transparent 70%)`,
        boxShadow: `0 0 60px ${pattern.color}10`,
      };
    }
    if (phase.className === 'inhale') {
      return {
        background: `radial-gradient(circle, ${pattern.color}30 0%, ${pattern.color}08 50%, transparent 80%)`,
        boxShadow: `0 0 80px ${pattern.color}20, inset 0 0 40px ${pattern.color}10`,
      };
    }
    if (phase.className === 'hold') {
      return {
        background: `radial-gradient(circle, ${pattern.color}25 0%, ${pattern.color}08 50%, transparent 80%)`,
        boxShadow: `0 0 60px ${pattern.color}15`,
      };
    }
    return {
      background: `radial-gradient(circle, ${pattern.color}12 0%, transparent 60%)`,
      boxShadow: `0 0 40px ${pattern.color}08`,
    };
  }, [running, phase, pattern.color]);

  return (
    <div className="view-container resonance-container" id="resonance-view">
      {/* Header */}
      <motion.div
        className="view-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem' }}
      >
        <div>
          <h1 className="heading-xl" id="resonance-title">Resonance</h1>
          <p className="text-caption" style={{ marginTop: '4px' }}>
            AI-Adaptive Breathing • {pattern.name}
          </p>
        </div>
        <button
          className={`btn btn-ghost btn-icon`}
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute' : 'Enable sound'}
          id="resonance-sound-toggle"
          style={{ fontSize: '1rem' }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </motion.div>

      {/* Nebula Visualization */}
      <motion.div
        className="resonance-nebula"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Outer rings */}
        <div
          className="nebula-ring"
          style={{
            width: running && phase.className === 'inhale' ? '280px' : '180px',
            height: running && phase.className === 'inhale' ? '280px' : '180px',
            borderColor: pattern.color,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            transition: `all ${phase?.duration || 4}s var(--ease-out)`,
          }}
        />
        <div
          className="nebula-ring"
          style={{
            width: running && phase.className === 'inhale' ? '320px' : '200px',
            height: running && phase.className === 'inhale' ? '320px' : '200px',
            borderColor: pattern.color,
            opacity: 0.15,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            transition: `all ${phase?.duration || 4}s var(--ease-out) 0.2s`,
          }}
        />

        {/* Core Nebula */}
        <div
          className={`nebula-core ${running ? phase.className : ''}`}
          style={{
            ...nebulaStyle,
            borderRadius: '50%',
            transition: `all ${phase?.duration || 4}s var(--ease-out)`,
          }}
        >
          <span className="resonance-phase" style={{ color: pattern.color }}>
            {running ? phase.name : 'Ready'}
          </span>
        </div>
      </motion.div>

      {/* Timer */}
      <motion.div
        className="resonance-timer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {running ? countdown : '—'}
      </motion.div>

      {/* Info */}
      <div className="resonance-info">
        {running
          ? `Cycle ${cycles + 1} • ${pattern.phases.map((p) => p.duration).join('-')}`
          : pattern.description}
      </div>

      {/* Pattern Selector */}
      {!running && (
        <motion.div
          className="breathing-patterns"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
            <button
              key={key}
              className={`btn ${breathingPattern === key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                setBreathingPattern(key);
                setPhaseIndex(0);
                setCountdown(p.phases[0].duration);
              }}
              id={`pattern-${key}`}
              style={{ fontSize: '0.78rem' }}
            >
              {p.name}
            </button>
          ))}
        </motion.div>
      )}

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ display: 'flex', gap: '0.75rem' }}
      >
        {!running ? (
          <button className="btn btn-primary" onClick={start} id="resonance-start">
            Begin Resonance
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={stop} id="resonance-stop">
            End Session
          </button>
        )}
      </motion.div>
    </div>
  );
}
