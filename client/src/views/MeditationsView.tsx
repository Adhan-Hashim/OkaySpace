import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { playAmbient, stopAmbient, setAmbientVolume } from '../modules/ambientAudio';
import { GUIDED_MEDITATIONS, Meditation } from '../modules/MeditationsData';
import { initTTS, playMeditationSequence, stopTTS } from '../modules/ttsEngine';

const BREATHING_PATTERNS = {
  box: { name: 'Box Breathing', description: 'Military-grade calm', phases: [{ name: 'Inhale', duration: 4, className: 'inhale' }, { name: 'Hold', duration: 4, className: 'hold' }, { name: 'Exhale', duration: 4, className: 'exhale' }, { name: 'Hold', duration: 4, className: 'hold' }], color: '#a3c9e2' },
  relaxing: { name: '4-7-8 Relaxing', description: 'Deep relaxation', phases: [{ name: 'Inhale', duration: 4, className: 'inhale' }, { name: 'Hold', duration: 7, className: 'hold' }, { name: 'Exhale', duration: 8, className: 'exhale' }], color: '#b2f7ef' },
  coherent: { name: 'Coherent', description: 'Heart-brain sync', phases: [{ name: 'Inhale', duration: 5, className: 'inhale' }, { name: 'Exhale', duration: 5, className: 'exhale' }], color: '#c8b6ff' },
  energizing: { name: 'Energizing', description: 'Rapid activation', phases: [{ name: 'Inhale', duration: 2, className: 'inhale' }, { name: 'Exhale', duration: 2, className: 'exhale' }], color: '#fdf0d5' },
  calming: { name: 'Extended Exhale', description: 'Vagus nerve activation', phases: [{ name: 'Inhale', duration: 4, className: 'inhale' }, { name: 'Exhale', duration: 8, className: 'exhale' }], color: '#ffb5a7' },
};

function createAudioContext() {
  try { return new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; }
}

function playTone(audioCtx: AudioContext | null, frequency: number, duration: number, volume = 0.05) {
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

export default function MeditationsView() {
  const breathingPattern = useStore((s) => s.breathingPattern);
  const setBreathingPattern = useStore((s) => s.setBreathingPattern);
  const setBreathingActive = useStore((s) => s.setBreathingActive);
  const addNeuralNode = useStore((s) => s.addNeuralNode);
  const setEmotion = useStore((s) => s.setEmotion);

  const [activeTab, setActiveTab] = useState<'breathing' | 'guided'>('breathing');
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Ambient settings
  const [ambientType, setAmbientType] = useState<'none' | 'space' | 'ocean' | 'binaural'>('none');
  const [guideVolume, setGuideVolume] = useState(0.05);
  const [ambientVolume, setAmbientVol] = useState(0.2);
  const [showSettings, setShowSettings] = useState(false);

  // Guided state
  const [activeMeditation, setActiveMeditation] = useState<Meditation | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [meditationRunning, setMeditationRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const pattern = BREATHING_PATTERNS[breathingPattern];
  const phase = pattern.phases[phaseIndex];

  useEffect(() => {
    initTTS();
    return () => {
      stopTTS();
      stopAmbient();
    };
  }, []);

  // --- BREATHING LOGIC ---
  const startBreathing = useCallback(() => {
    setRunning(true);
    setBreathingActive(true);
    setPhaseIndex(0);
    setCountdown(pattern.phases[0].duration);
    setCycles(0);
    if (soundEnabled && !audioCtxRef.current) audioCtxRef.current = createAudioContext();
    if (soundEnabled && ambientType !== 'none') playAmbient(ambientType, ambientVolume);
  }, [pattern, soundEnabled, ambientType, ambientVolume, setBreathingActive]);

  const stopBreathing = useCallback(() => {
    setRunning(false);
    setBreathingActive(false);
    setPhaseIndex(0);
    setCountdown(pattern.phases[0].duration);
    if (intervalRef.current) clearInterval(intervalRef.current);
    stopAmbient();
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
    if (running && soundEnabled) setAmbientVolume(ambientVolume);
  }, [ambientVolume, running, soundEnabled]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => {
            const next = (pi + 1) % pattern.phases.length;
            if (next === 0) setCycles((c) => c + 1);
            if (soundEnabled && audioCtxRef.current) {
              const freq = pattern.phases[next].className === 'inhale' ? 396 : pattern.phases[next].className === 'hold' ? 528 : 639;
              playTone(audioCtxRef.current, freq, pattern.phases[next].duration, guideVolume);
            }
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate(pattern.phases[next].className === 'hold' ? 10 : 30);
            }
            return next;
          });
          return pattern.phases[(phaseIndex + 1) % pattern.phases.length].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phaseIndex, pattern, soundEnabled, guideVolume]);

  const nebulaStyle = useMemo(() => {
    if (!running) return { background: `radial-gradient(circle, ${pattern.color}15 0%, transparent 70%)`, boxShadow: `0 0 60px ${pattern.color}10` };
    if (phase.className === 'inhale') return { background: `radial-gradient(circle, ${pattern.color}30 0%, ${pattern.color}08 50%, transparent 80%)`, boxShadow: `0 0 80px ${pattern.color}20, inset 0 0 40px ${pattern.color}10` };
    if (phase.className === 'hold') return { background: `radial-gradient(circle, ${pattern.color}25 0%, ${pattern.color}08 50%, transparent 80%)`, boxShadow: `0 0 60px ${pattern.color}15` };
    return { background: `radial-gradient(circle, ${pattern.color}12 0%, transparent 60%)`, boxShadow: `0 0 40px ${pattern.color}08` };
  }, [running, phase, pattern.color]);

  // --- GUIDED MEDITATION LOGIC ---
  const startGuided = (meditation: Meditation) => {
    setActiveMeditation(meditation);
    setMeditationRunning(true);
    setActiveStepIndex(0);
    if (soundEnabled && ambientType !== 'none') playAmbient(ambientType, ambientVolume);
    
    playMeditationSequence(meditation.steps, (idx) => {
      setActiveStepIndex(idx);
    }, () => {
      stopGuided();
      addNeuralNode({
        emotion: 'calm',
        text: `Completed ${meditation.title}`,
        source: 'resonance',
        intensity: 0.8,
      });
      setEmotion('calm', 0.8);
    });
  };

  const stopGuided = () => {
    stopTTS();
    stopAmbient();
    setMeditationRunning(false);
    setActiveStepIndex(-1);
    setActiveMeditation(null);
  };

  return (
    <div className="view-container resonance-container" id="meditations-view">
      {/* Header */}
      <motion.div className="view-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem' }}>
        <div>
          <h1 className="heading-xl">Meditations</h1>
          <p className="text-caption" style={{ marginTop: '4px' }}>
            {activeTab === 'breathing' ? `AI-Adaptive Breathing • ${pattern.name}` : 'Guided Audio & Visualization'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-ghost btn-icon ${soundEnabled ? 'active' : ''}`}
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (soundEnabled) stopAmbient();
              if (!soundEnabled && ambientType !== 'none') playAmbient(ambientType, ambientVolume);
            }}
            title={soundEnabled ? 'Mute' : 'Enable sound'}
            style={{ fontSize: '1rem', color: soundEnabled ? 'var(--text)' : 'var(--text-muted)' }}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          {!running && !meditationRunning && (
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
              style={{ fontSize: '1rem', color: showSettings ? 'var(--text)' : 'var(--text-muted)' }}
            >
              ⚙️
            </button>
          )}
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {!running && !meditationRunning && showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 80 }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', padding: '0 2rem', position: 'absolute', top: '2rem', zIndex: 10, width: '100%' }}>
            <div style={{ background: 'var(--surface-hover)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="text-caption" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Ambient Soundscape</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['none', 'space', 'ocean', 'binaural'].map((t) => (
                    <button key={t} onClick={() => setAmbientType(t as any)} className={`btn ${ambientType === t ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '0.78rem', textTransform: 'capitalize' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {soundEnabled && ambientType !== 'none' && (
                <div>
                  <label className="text-caption" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Ambience Volume</label>
                  <input type="range" min="0" max="0.5" step="0.01" value={ambientVolume} onChange={(e) => setAmbientVol(parseFloat(e.target.value))} style={{ width: '100%' }} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      {!running && !meditationRunning && (
        <div style={{ position: 'absolute', top: '7rem', left: '2rem', display: 'flex', gap: '1rem' }}>
          <button className={`btn ${activeTab === 'breathing' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('breathing')}>Breathing</button>
          <button className={`btn ${activeTab === 'guided' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('guided')}>Guided Series</button>
        </div>
      )}

      {/* BREATHING VIEW */}
      {activeTab === 'breathing' && !meditationRunning && (
        <>
          <motion.div className="resonance-nebula" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="nebula-ring" style={{ width: running && phase.className === 'inhale' ? '280px' : '180px', height: running && phase.className === 'inhale' ? '280px' : '180px', borderColor: pattern.color, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transition: `all ${phase?.duration || 4}s var(--ease-out)` }} />
            <div className="nebula-ring" style={{ width: running && phase.className === 'inhale' ? '320px' : '200px', height: running && phase.className === 'inhale' ? '320px' : '200px', borderColor: pattern.color, opacity: 0.15, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transition: `all ${phase?.duration || 4}s var(--ease-out) 0.2s` }} />
            <div className={`nebula-core ${running ? phase.className : ''}`} style={{ ...nebulaStyle, borderRadius: '50%', transition: `all ${phase?.duration || 4}s var(--ease-out)` }}>
              <span className="resonance-phase" style={{ color: pattern.color }}>{running ? phase.name : 'Ready'}</span>
            </div>
          </motion.div>
          
          <motion.div className="resonance-timer">{running ? countdown : '—'}</motion.div>
          <div className="resonance-info">{running ? `Cycle ${cycles + 1} • ${pattern.phases.map((p) => p.duration).join('-')}` : pattern.description}</div>

          {!running && (
            <motion.div className="breathing-patterns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20vh' }}>
              {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
                <button key={key} className={`btn ${breathingPattern === key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setBreathingPattern(key)} style={{ fontSize: '0.78rem' }}>
                  {p.name}
                </button>
              ))}
            </motion.div>
          )}

          <motion.div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
            {!running ? <button className="btn btn-primary" onClick={startBreathing}>Begin</button> : <button className="btn btn-secondary" onClick={stopBreathing}>End Session</button>}
          </motion.div>
        </>
      )}

      {/* GUIDED MEDITATIONS VIEW */}
      {activeTab === 'guided' && !running && (
        <div style={{ marginTop: '10rem', width: '100%', maxWidth: '800px', padding: '0 2rem', overflowY: 'auto', maxHeight: '70vh' }}>
          
          {!meditationRunning ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {GUIDED_MEDITATIONS.map((m) => (
                <div key={m.id} style={{ background: 'var(--surface-solid)', padding: '1.5rem', borderRadius: '12px', border: '2px solid var(--text-primary)', boxShadow: '4px 4px 0px var(--accent)' }}>
                  <h3 className="heading-sm" style={{ marginBottom: '0.5rem' }}>{m.title}</h3>
                  <p className="text-caption" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{m.duration} • Best for: {m.bestFor}</p>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => startGuided(m)}>Play Audio Session</button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>{activeMeditation?.title}</h2>
              <div style={{ background: 'var(--surface-solid)', padding: '2rem', borderRadius: '12px', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--text-primary)', boxShadow: '4px 4px 0px var(--accent)' }}>
                <p className="text-body" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                  {activeStepIndex >= 0 ? activeMeditation?.steps[activeStepIndex] : 'Starting session...'}
                </p>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <button className="btn btn-secondary" onClick={stopGuided}>End Session</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
