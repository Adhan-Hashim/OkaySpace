import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { playAmbient, stopAmbient, setAmbientVolume } from '../modules/ambientAudio';
import { initTTS, playMeditationSequence, stopTTS } from '../modules/ttsEngine';
import bgForest from '../assets/bg-forest.png';

const BREATHING_PATTERNS = {
  box:        { name: 'Box Breathing',     desc: 'Military-grade calm',      color: '#7FB69D', bg: '#D4EDE5', phases: [{ name: 'Inhale', d: 4 }, { name: 'Hold', d: 4 }, { name: 'Exhale', d: 4 }, { name: 'Hold', d: 4 }] },
  relaxing:   { name: '4-7-8 Relaxing',   desc: 'Deep relaxation',          color: '#5FA8A5', bg: '#C8ECEE', phases: [{ name: 'Inhale', d: 4 }, { name: 'Hold', d: 7 }, { name: 'Exhale', d: 8 }] },
  coherent:   { name: 'Coherent',          desc: 'Heart-brain sync',         color: '#B794F4', bg: '#E9D8FD', phases: [{ name: 'Inhale', d: 5 }, { name: 'Exhale', d: 5 }] },
  energizing: { name: 'Energizing',        desc: 'Rapid activation',         color: '#F6AD55', bg: '#FFF3E0', phases: [{ name: 'Inhale', d: 2 }, { name: 'Exhale', d: 2 }] },
  calming:    { name: 'Extended Exhale',   desc: 'Vagus nerve activation',   color: '#F687B3', bg: '#FFE4E8', phases: [{ name: 'Inhale', d: 4 }, { name: 'Exhale', d: 8 }] },
};

const MEDITATION_COLORS = [
  'linear-gradient(135deg, #D4EDE5, #A8DADC)',
  'linear-gradient(135deg, #E8DEFF, #C8ECEE)',
  'linear-gradient(135deg, #FFF3E0, #D4EDE5)',
  'linear-gradient(135deg, #FFE4E8, #E8DEFF)',
  'linear-gradient(135deg, #C8ECEE, #D4EDE5)',
  'linear-gradient(135deg, #FFF0F0, #FFE4E8)',
];
const MEDITATION_EMOJIS = ['🌊', '🌙', '🌿', '🌅', '❄️', '🔥'];

function createAudioContext() {
  try { return new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; }
}
function playTone(ac: AudioContext | null, freq: number, dur: number, vol = 0.05) {
  if (!ac) return;
  const osc = ac.createOscillator(); const gain = ac.createGain();
  osc.connect(gain); gain.connect(ac.destination);
  osc.type = 'sine'; osc.frequency.setValueAtTime(freq, ac.currentTime);
  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + 0.5);
  gain.gain.linearRampToValueAtTime(0, ac.currentTime + dur);
  osc.start(ac.currentTime); osc.stop(ac.currentTime + dur);
}

// Breathing orb component
function BreathingOrb({ running, phase, pattern, countdown, cycles }: any) {
  const isInhale  = phase?.name === 'Inhale';
  const isHold    = phase?.name === 'Hold';
  const orbSize   = running ? (isInhale ? 220 : isHold ? 200 : 160) : 180;
  const ringSize1 = running ? (isInhale ? 270 : 220) : 230;
  const ringSize2 = running ? (isInhale ? 310 : 255) : 270;

  return (
    <div className="breathing-center">
      <div className="breathing-orb-wrap" style={{ width: 320, height: 320 }}>
        {/* Outer rings */}
        <div className="breathing-orb-ring" style={{
          width: ringSize2, height: ringSize2,
          borderColor: pattern.color,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: `all ${phase?.d || 4}s cubic-bezier(0,0,0.2,1)`,
          position: 'absolute',
        }} />
        <div className="breathing-orb-ring" style={{
          width: ringSize1, height: ringSize1,
          borderColor: pattern.color,
          opacity: 0.35,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: `all ${phase?.d || 4}s cubic-bezier(0,0,0.2,1) 0.15s`,
          position: 'absolute',
        }} />
        {/* Core orb */}
        <div className="breathing-orb" style={{
          width: orbSize, height: orbSize,
          background: `radial-gradient(circle at 35% 35%, white 0%, ${pattern.color}40 60%, ${pattern.color}20 100%)`,
          boxShadow: `0 0 80px ${pattern.color}30, inset 0 0 40px ${pattern.color}15, 0 0 120px ${pattern.color}15`,
          transition: `all ${phase?.d || 4}s cubic-bezier(0,0,0.2,1)`,
        }}>
          <div className="breathing-phase" style={{ color: pattern.color }}>
            {running ? phase?.name : 'Ready'}
          </div>
          <div className="breathing-count" style={{ color: pattern.color }}>
            {running ? countdown : '—'}
          </div>
        </div>
      </div>

      {/* Cycle info */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 'var(--sp-1)' }}>
          {running ? `Cycle ${cycles + 1}  ·  ${pattern.phases.map((p: any) => p.d).join('-')} pattern` : pattern.desc}
        </div>
        <div className="pill pill-green" style={{ background: pattern.bg, color: pattern.color, display: 'inline-flex' }}>
          {pattern.name}
        </div>
      </div>
    </div>
  );
}

export default function MeditationsView() {
  const breathingPattern    = useStore((s) => s.breathingPattern);
  const setBreathingPattern = useStore((s) => s.setBreathingPattern);
  const setBreathingActive  = useStore((s) => s.setBreathingActive);
  const addNeuralNode       = useStore((s) => s.addNeuralNode);
  const setEmotion          = useStore((s) => s.setEmotion);

  const [activeTab, setActiveTab]           = useState<'breathing' | 'guided'>('breathing');
  const [running, setRunning]               = useState(false);
  const [phaseIndex, setPhaseIndex]         = useState(0);
  const [countdown, setCountdown]           = useState(0);
  const [cycles, setCycles]                 = useState(0);
  const [soundEnabled, setSoundEnabled]     = useState(false);
  const [ambientType, setAmbientType]       = useState<'none' | 'space' | 'ocean' | 'binaural'>('none');
  const [guideVolume, setGuideVolume]       = useState(0.05);
  const [ambientVolume, setAmbientVol]      = useState(0.2);
  const [showSettings, setShowSettings]     = useState(false);
  const [activeMeditation, setActiveMeditation] = useState<Meditation | null>(null);
  const [activeStepIndex, setActiveStepIndex]   = useState(-1);
  const [meditationRunning, setMeditationRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const pattern = BREATHING_PATTERNS[breathingPattern];
  const phase   = pattern.phases[phaseIndex];

  useEffect(() => { initTTS(); return () => { stopTTS(); stopAmbient(); }; }, []);

  const startBreathing = useCallback(() => {
    setRunning(true); setBreathingActive(true);
    setPhaseIndex(0); setCountdown(pattern.phases[0].d); setCycles(0);
    if (soundEnabled && !audioCtxRef.current) audioCtxRef.current = createAudioContext();
    if (soundEnabled && ambientType !== 'none') playAmbient(ambientType, ambientVolume);
  }, [pattern, soundEnabled, ambientType, ambientVolume, setBreathingActive]);

  const stopBreathing = useCallback(() => {
    setRunning(false); setBreathingActive(false);
    setPhaseIndex(0); setCountdown(pattern.phases[0].d);
    if (intervalRef.current) clearInterval(intervalRef.current);
    stopAmbient();
    if (cycles > 0) {
      addNeuralNode({ emotion: 'calm', text: `${pattern.name} breathing — ${cycles} cycles`, source: 'resonance', intensity: Math.min(0.3 + cycles * 0.1, 1) });
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
              const freq = pattern.phases[next].name === 'Inhale' ? 396 : pattern.phases[next].name === 'Hold' ? 528 : 639;
              playTone(audioCtxRef.current, freq, pattern.phases[next].d, guideVolume);
            }
            return next;
          });
          return pattern.phases[(phaseIndex + 1) % pattern.phases.length].d;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running, phaseIndex, pattern, soundEnabled, guideVolume]);

  const startGuided = (meditation: Meditation) => {
    setActiveMeditation(meditation);
    setMeditationRunning(true);
    setActiveStepIndex(0);
    if (soundEnabled && ambientType !== 'none') playAmbient(ambientType, ambientVolume);
    playMeditationSequence(meditation.steps, (idx) => setActiveStepIndex(idx), () => {
      stopGuided();
      addNeuralNode({ emotion: 'calm', text: `Completed ${meditation.title}`, source: 'resonance', intensity: 0.8 });
      setEmotion('calm', 0.8);
    });
  };

  const stopGuided = () => {
    stopTTS(); stopAmbient();
    setMeditationRunning(false); setActiveStepIndex(-1); setActiveMeditation(null);
  };

  return (
    <motion.div
      className="meditations-page-nature"
      id="meditations-view"
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

      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
      
      {/* Header */}
      <div className="view-header" style={{ background: 'rgba(255,255,255,0.4)', padding: 'var(--sp-4)', borderRadius: 'var(--r-xl)', marginBottom: 'var(--sp-6)' }}>
        <div className="view-header-left">
          <div className="view-eyebrow" style={{ color: 'var(--primary-dark)' }}>🌸 &nbsp;Breathe & Reflect</div>
          <h1 className="view-title t-organic" style={{ color: 'var(--primary-dark)' }}>Meditations</h1>
          <p className="view-subtitle" style={{ color: 'var(--primary-dark)' }}>
            {activeTab === 'breathing' ? `${pattern.name} · ${pattern.desc}` : 'Guided audio & visualization sessions'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
          <button
            className={`btn btn-icon ${soundEnabled ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setSoundEnabled(!soundEnabled); if (soundEnabled) stopAmbient(); }}
            title={soundEnabled ? 'Mute' : 'Enable sound'}
            style={{ fontSize: '1rem' }}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          {!running && !meditationRunning && (
            <button
              className={`btn btn-icon btn-ghost ${showSettings ? 'btn-primary' : ''}`}
              onClick={() => setShowSettings(!showSettings)}
              style={{ fontSize: '1rem' }}
            >
              ⚙️
            </button>
          )}
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && !running && !meditationRunning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 'var(--sp-4)' }}
          >
            <div className="med-settings-panel glass-panel" style={{ padding: 'var(--sp-5)' }}>
              <div>
                <div className="t-label" style={{ marginBottom: 'var(--sp-3)' }}>Ambient Soundscape</div>
                <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                  {['none', 'space', 'ocean', 'binaural'].map((t) => (
                    <button key={t} onClick={() => setAmbientType(t as any)}
                      className={`btn btn-sm ${ambientType === t ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ textTransform: 'capitalize' }}>
                      {t === 'none' ? '🔇 None' : t === 'space' ? '🌌 Space' : t === 'ocean' ? '🌊 Ocean' : '🎵 Binaural'}
                    </button>
                  ))}
                </div>
              </div>
              {soundEnabled && ambientType !== 'none' && (
                <div>
                  <div className="t-label" style={{ marginBottom: 'var(--sp-2)' }}>Ambient Volume</div>
                  <input type="range" min="0" max="0.5" step="0.01" value={ambientVolume}
                    onChange={(e) => setAmbientVol(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      {!running && !meditationRunning && (
        <div className="med-tabs glass-panel" style={{ padding: 'var(--sp-2)' }}>
          <button className={`med-tab${activeTab === 'breathing' ? ' active' : ''}`} onClick={() => setActiveTab('breathing')}>
            🌬️ Breathing
          </button>
          <button className={`med-tab${activeTab === 'guided' ? ' active' : ''}`} onClick={() => setActiveTab('guided')}>
            🎧 Guided Series
          </button>
        </div>
      )}

      {/* ── BREATHING TAB ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'breathing' && !meditationRunning && (
          <motion.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 'var(--sp-6)' }}>

            <BreathingOrb running={running} phase={phase} pattern={pattern} countdown={countdown} cycles={cycles} />

            {/* Pattern selector (only when stopped) */}
            {!running && (
              <motion.div className="breathing-patterns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
                  <button key={key}
                    className={`btn btn-sm ${breathingPattern === key ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setBreathingPattern(key)}
                    style={breathingPattern === key ? {} : { borderColor: p.color, color: p.color }}
                  >
                    {p.name}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Start / Stop */}
            <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
              {!running ? (
                <button className="btn btn-primary btn-lg" onClick={startBreathing}>
                  🌬️ &nbsp;Begin Session
                </button>
              ) : (
                <button className="btn btn-secondary btn-lg" onClick={stopBreathing}>
                  ⏹ &nbsp;End Session
                </button>
              )}
            </div>

            {/* Tips */}
            {!running && (
              <div className="glass-panel" style={{ padding: 'var(--sp-5) var(--sp-6)', maxWidth: '480px', marginTop: 'var(--sp-6)' }}>
                <div className="t-label" style={{ marginBottom: 'var(--sp-3)', color: 'var(--primary-dark)' }}>💡 Why this works</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.7 }}>
                  {pattern.name === 'Box Breathing' && 'Box breathing (4-4-4-4) is used by Navy SEALs to achieve instant calm. It balances CO₂ and O₂, slowing your heart rate and cortisol levels.'}
                  {pattern.name === '4-7-8 Relaxing' && 'The 4-7-8 method activates your parasympathetic nervous system. The long 8-count exhale stimulates the vagus nerve, reducing anxiety within minutes.'}
                  {pattern.name === 'Coherent' && 'Coherent breathing (5-5) synchronizes your heart rate and breath, creating optimal heart rate variability (HRV) — a key marker of resilience.'}
                  {pattern.name === 'Energizing' && 'Rapid 2-2 breathing oxygenates the blood quickly, mimicking the physiological effect of mild exercise. Perfect for low-energy moments.'}
                  {pattern.name === 'Extended Exhale' && 'An exhale twice as long as the inhale maximally stimulates the vagus nerve, quickly shifting your autonomic nervous system from stress to rest.'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── GUIDED TAB ── */}
        {activeTab === 'guided' && !running && (
          <motion.div key="guided" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1 }}>
            {!meditationRunning ? (
              <div className="guided-grid">
                {GUIDED_MEDITATIONS.map((m, i) => (
                  <motion.div
                    key={m.id}
                    className="meditation-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <div className="meditation-card-header" style={{ background: MEDITATION_COLORS[i % MEDITATION_COLORS.length] }}>
                      <span style={{ fontSize: '3rem' }}>{MEDITATION_EMOJIS[i % MEDITATION_EMOJIS.length]}</span>
                    </div>
                    <div className="meditation-card-body">
                      <div className="meditation-card-title">{m.title}</div>
                      <div className="meditation-card-meta">⏱ {m.duration} &nbsp;·&nbsp; ✦ Best for: {m.bestFor}</div>
                      <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--sp-2)' }} onClick={() => startGuided(m)}>
                        ▶ &nbsp;Play Audio Session
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Active guided session */
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 'var(--sp-8) 0' }}>
                <div className="meditation-session-card">
                  <div style={{ fontSize: '3rem' }}>{MEDITATION_EMOJIS[GUIDED_MEDITATIONS.indexOf(activeMeditation!) % MEDITATION_EMOJIS.length]}</div>
                  <div>
                    <div className="t-label" style={{ marginBottom: 'var(--sp-2)', textAlign: 'center' }}>Now Playing</div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--text)', textAlign: 'center' }}>{activeMeditation?.title}</h2>
                  </div>
                  <div style={{
                    background: 'var(--bg)', borderRadius: 'var(--r-xl)',
                    padding: 'var(--sp-8)', width: '100%',
                    border: '1px solid var(--border-light)', minHeight: '120px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <p className="meditation-step-text">
                      {activeStepIndex >= 0 ? activeMeditation?.steps[activeStepIndex] : 'Starting your session...'}
                    </p>
                  </div>
                  {/* Progress dots */}
                  <div style={{ display: 'flex', gap: 'var(--sp-2)', justifyContent: 'center' }}>
                    {activeMeditation?.steps.map((_, i) => (
                      <div key={i} style={{
                        width: i === activeStepIndex ? 20 : 8,
                        height: 8, borderRadius: 'var(--r-full)',
                        background: i <= activeStepIndex ? 'var(--primary)' : 'var(--border)',
                        transition: 'all 0.3s ease',
                      }} />
                    ))}
                  </div>
                  <button className="btn btn-secondary" onClick={stopGuided} style={{ width: '100%' }}>
                    ⏹ &nbsp;End Session
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
}
