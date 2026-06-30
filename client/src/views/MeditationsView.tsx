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
const MEDITATION_EMOJIS = ['', '', '', '', '', ''];

function createAudioContext() {
  try { return new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; }
}
function playTone(ac: AudioContext | null, freq: number, dur: number, vol = 0.05) {
  if (!ac) return;
  if (ac.state === 'suspended') {
    ac.resume().catch(() => {});
  }
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
    if (soundEnabled) {
      if (!audioCtxRef.current) audioCtxRef.current = createAudioContext();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      if (ambientType !== 'none') playAmbient(ambientType, ambientVolume);
    }
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

  // Handle live sound toggling/ambient changes during active sessions
  useEffect(() => {
    if (running || meditationRunning) {
      if (soundEnabled && ambientType !== 'none') {
        playAmbient(ambientType, ambientVolume);
        if (running && !audioCtxRef.current) {
          audioCtxRef.current = createAudioContext();
        }
        if (running && audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
      } else {
        stopAmbient();
      }
    }
  }, [soundEnabled, ambientType, running, meditationRunning]);

  useEffect(() => {
    if (soundEnabled) setAmbientVolume(ambientVolume);
  }, [ambientVolume, soundEnabled]);

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
      className="vd-page-bg vd-page-wrapper"
      id="meditations-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45 }}
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'calc(-1 * var(--nav-h))',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
      
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-8)', borderBottom: '2px solid #000000', paddingBottom: 'var(--sp-4)' }}>
          <div className="view-header-left">
            <h1 className="vd-title-large">MEDITATIONS</h1>
            <p className="vd-subtitle">
              {activeTab === 'breathing' ? `${pattern.name} · ${pattern.desc}` : 'Guided audio & visualization sessions'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              className={soundEnabled ? 'vd-btn-pill' : 'vd-btn-pill-secondary'}
              onClick={() => { setSoundEnabled(!soundEnabled); if (soundEnabled) stopAmbient(); }}
              title={soundEnabled ? 'Mute' : 'Enable sound'}
              style={{ minHeight: '40px', height: '40px', padding: '0 1rem', fontSize: '0.85rem' }}
            >
              {soundEnabled ? '🔊 SOUND ON' : '🔇 SOUND OFF'}
            </button>
            {!running && !meditationRunning && (
              <button
                className={showSettings ? 'vd-btn-pill' : 'vd-btn-pill-secondary'}
                onClick={() => setShowSettings(!showSettings)}
                style={{ minHeight: '40px', height: '40px', padding: '0 1rem', fontSize: '0.85rem' }}
              >
                SETTINGS
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
              style={{ overflow: 'hidden', marginBottom: 'var(--sp-6)' }}
            >
              <div className="vd-card-flat" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', color: '#000000', marginBottom: 'var(--sp-2)' }}>Ambient Soundscape</div>
                  <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                    {['none', 'space', 'ocean', 'binaural'].map((t) => (
                      <button key={t} onClick={() => setAmbientType(t as any)}
                        className={ambientType === t ? 'vd-btn-pill' : 'vd-btn-pill-secondary'}
                        style={{ minHeight: '35px', height: '35px', padding: '0 1rem', fontSize: '0.8rem' }}>
                        {t === 'none' ? 'None' : t}
                      </button>
                    ))}
                  </div>
                </div>
                {soundEnabled && ambientType !== 'none' && (
                  <div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', color: '#000000', marginBottom: 'var(--sp-2)' }}>Ambient Volume</div>
                    <input type="range" min="0" max="0.5" step="0.01" value={ambientVolume}
                      onChange={(e) => setAmbientVol(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#000000' }} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        {!running && !meditationRunning && (
          <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)' }}>
            <button className={activeTab === 'breathing' ? 'vd-btn-pill' : 'vd-btn-pill-secondary'} onClick={() => setActiveTab('breathing')}>
              Breathing
            </button>
            <button className={activeTab === 'guided' ? 'vd-btn-pill' : 'vd-btn-pill-secondary'} onClick={() => setActiveTab('guided')}>
              Guided Series
            </button>
          </div>
        )}

        {/* ── BREATHING TAB ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'breathing' && !meditationRunning && (
            <motion.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 'var(--sp-8)' }}>

              {/* Breathing orb wrapper */}
              <div className="breathing-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)' }}>
                <div style={{
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  border: '3px solid #000000',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  transform: running ? (phase?.name === 'Inhale' ? 'scale(1.15)' : phase?.name === 'Hold' ? 'scale(1.1)' : 'scale(0.9)') : 'scale(1)',
                  transition: `transform ${phase?.d || 4}s cubic-bezier(0.4, 0, 0.2, 1)`,
                }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#000000', textTransform: 'uppercase' }}>
                    {running ? phase?.name : 'Ready'}
                  </div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '3rem', color: '#000000', marginTop: 'var(--sp-2)' }}>
                    {running ? countdown : '—'}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9rem', color: '#666666', marginBottom: 'var(--sp-2)' }}>
                    {running ? `Cycle ${cycles + 1}  ·  ${pattern.phases.map((p: any) => p.d).join('-')} pattern` : pattern.desc}
                  </div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: '#000000' }}>
                    {pattern.name}
                  </div>
                </div>
              </div>

              {/* Pattern selector (only when stopped) */}
              {!running && (
                <motion.div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', justifyContent: 'center' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
                    <button key={key}
                      className={breathingPattern === key ? 'vd-btn-pill' : 'vd-btn-pill-secondary'}
                      onClick={() => setBreathingPattern(key)}
                      style={{ minHeight: '38px', height: '38px', padding: '0 1rem', fontSize: '0.8rem' }}
                    >
                      {p.name}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Start / Stop */}
              <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
                {!running ? (
                  <button className="vd-btn-pill" onClick={startBreathing}>
                    Begin Session
                  </button>
                ) : (
                  <button className="vd-btn-pill" onClick={stopBreathing} style={{ backgroundColor: '#ff3b30', borderColor: '#ff3b30' }}>
                    ⏹ End Session
                  </button>
                )}
              </div>

              {/* Tips */}
              {!running && (
                <div className="vd-card-flat" style={{ maxWidth: '500px', width: '100%', marginTop: 'var(--sp-4)' }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', color: '#000000', marginBottom: 'var(--sp-2)' }}>Why this works</div>
                  <p style={{ fontSize: '0.9rem', color: '#333333', lineHeight: 1.7 }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-6)' }}>
                  {GUIDED_MEDITATIONS.map((m, i) => (
                    <motion.div
                      key={m.id}
                      className="vd-card-flat"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
                    >
                      <div>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#000000', marginBottom: 'var(--sp-2)' }}>
                          {m.title}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666666', fontWeight: 500, marginBottom: 'var(--sp-4)' }}>
                          ⏱ {m.duration}  ·  Best for: {m.bestFor}
                        </div>
                      </div>
                      <button className="vd-btn-pill" style={{ width: '100%', minHeight: '40px', height: '40px', fontSize: '0.85rem' }} onClick={() => startGuided(m)}>
                        ▶ Play Audio Session
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Active guided session */
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 'var(--sp-8) 0' }}>
                  <div className="vd-card-flat" style={{ maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', color: '#666666', marginBottom: 'var(--sp-1)' }}>Now Playing</div>
                      <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#000000' }}>{activeMeditation?.title}</h2>
                    </div>
                    
                    <div style={{
                      backgroundColor: '#f9fafb',
                      border: '1.5px solid #000000',
                      borderRadius: '12px',
                      padding: 'var(--sp-6)',
                      width: '100%',
                      minHeight: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', lineHeight: 1.6, color: '#000000', fontWeight: 500 }}>
                        {activeStepIndex >= 0 ? activeMeditation?.steps[activeStepIndex] : 'Starting your session...'}
                      </p>
                    </div>

                    {/* Progress dots */}
                    <div style={{ display: 'flex', gap: 'var(--sp-2)', justifyContent: 'center' }}>
                      {activeMeditation?.steps.map((_, i) => (
                        <div key={i} style={{
                          width: i === activeStepIndex ? 24 : 8,
                          height: 8,
                          borderRadius: 'var(--r-full)',
                          background: i <= activeStepIndex ? '#000000' : '#e5e7eb',
                          transition: 'all 0.3s ease',
                        }} />
                      ))}
                    </div>
                    
                    <button className="vd-btn-pill" onClick={stopGuided} style={{ width: '100%', backgroundColor: '#ff3b30', borderColor: '#ff3b30' }}>
                      ⏹ End Session
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
