import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import useStore from '../store/useStore';
import bgForest from '../assets/bg-forest.png';

const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
const socket = io(socketUrl, { autoConnect: false });

const AI_PROMPTS = [
  "What's something that made you smile recently?",
  "If you could describe your current state in one color, what would it be?",
  "What's one kind thing you did for yourself today?",
  "What would you tell your younger self right now?",
  "What's a small victory you've had this week?",
  "If your feelings were weather, what's the forecast?",
];

// Cosmos illustration SVG
function CosmosIllustration({ seeking = false }: { seeking?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 200, height: 200 }}>
      {/* Background glow */}
      <circle cx="100" cy="100" r="90" fill="url(#cosmosGlow)" opacity="0.3"/>
      {/* Orbit rings */}
      <circle cx="100" cy="100" r="70" stroke="#7FB69D" strokeWidth="1" opacity="0.2" strokeDasharray="4 6"/>
      <circle cx="100" cy="100" r="50" stroke="#A8DADC" strokeWidth="1" opacity="0.25" strokeDasharray="3 5"/>
      {/* Center orb */}
      <circle cx="100" cy="100" r="28" fill="url(#centerOrb)"/>
      <circle cx="100" cy="100" r="22" fill="url(#innerOrb)" opacity="0.8"/>
      {/* Orbiting dots */}
      <circle cx="170" cy="100" r="6" fill="#A8DADC" opacity="0.8"/>
      <circle cx="30"  cy="100" r="5" fill="#7FB69D"  opacity="0.7"/>
      <circle cx="100" cy="30"  r="4" fill="#A8DADC"  opacity="0.6"/>
      <circle cx="100" cy="170" r="5" fill="#7FB69D"  opacity="0.7"/>
      {/* Stars */}
      <circle cx="145" cy="55"  r="2.5" fill="white" opacity="0.8"/>
      <circle cx="55"  cy="55"  r="2"   fill="white" opacity="0.7"/>
      <circle cx="55"  cy="145" r="2"   fill="white" opacity="0.6"/>
      <circle cx="145" cy="145" r="2.5" fill="white" opacity="0.7"/>
      <circle cx="80"  cy="40"  r="1.5" fill="white" opacity="0.5"/>
      <circle cx="160" cy="80"  r="1.5" fill="white" opacity="0.5"/>
      {/* Signal waves when seeking */}
      {seeking && <>
        <circle cx="100" cy="100" r="38" stroke="#7FB69D" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 4"/>
        <circle cx="100" cy="100" r="55" stroke="#7FB69D" strokeWidth="1" opacity="0.25" strokeDasharray="2 6"/>
        <circle cx="100" cy="100" r="72" stroke="#7FB69D" strokeWidth="0.75" opacity="0.12" strokeDasharray="2 8"/>
      </>}
      <defs>
        <radialGradient id="cosmosGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#A8DADC"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="centerOrb" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#C8ECEE"/>
          <stop offset="100%" stopColor="#5FA8A5"/>
        </radialGradient>
        <radialGradient id="innerOrb" cx="50%" cy="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function NexusView() {
  const addNeuralNode       = useStore((s) => s.addNeuralNode);
  const incrementInteraction = useStore((s) => s.incrementInteraction);

  const [status, setStatus]           = useState<'idle' | 'seeking' | 'helping' | 'connected'>('idle');
  const [messages, setMessages]       = useState<any[]>([]);
  const [tetheredRoom, setTetheredRoom] = useState<string | null>(null);
  const [activePings, setActivePings] = useState<string[]>([]);
  const [input, setInput]             = useState('');
  const [timeLeft, setTimeLeft]       = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    socket.connect();
    socket.on('active_pings', (pings) => setActivePings(pings.filter((id: string) => id !== socket.id)));
    socket.on('tethered', ({ room }) => {
      setTetheredRoom(room); setStatus('connected'); setTimeLeft(600);
      setMessages([{ id: Date.now(), text: 'Neural link established. You are now connected anonymously.', system: true }]);
      setTimeout(() => {
        const prompt = AI_PROMPTS[Math.floor(Math.random() * AI_PROMPTS.length)];
        setMessages((prev) => [...prev, { id: Date.now(), text: `💡 "${prompt}"`, system: true }]);
      }, 5000);
    });
    socket.on('receive_message', ({ text }) => setMessages((prev) => [...prev, { id: Date.now(), text, self: false }]));
    socket.on('tether_snapped', () => {
      setMessages((prev) => [...prev, { id: Date.now(), text: 'The neural link has been severed.', system: true }]);
      setTimeout(() => { setTetheredRoom(null); setMessages([]); setStatus('idle'); setTimeLeft(null); }, 3000);
    });
    return () => {
      socket.off('active_pings'); socket.off('tethered'); socket.off('receive_message'); socket.off('tether_snapped');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (status !== 'connected' || timeLeft === null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => { if (prev! <= 1) { disconnect(); return 0; } return prev! - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [status, timeLeft]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendPing    = useCallback(() => { setStatus('seeking'); socket.emit('sonar_ping'); }, []);
  const answerPing  = useCallback((id: string) => { socket.emit('answer_ping', id); }, []);
  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || !tetheredRoom) return;
    socket.emit('send_message', { room: tetheredRoom, text });
    setMessages((prev) => [...prev, { id: Date.now(), text, self: true }]);
    setInput(''); incrementInteraction();
  }, [input, tetheredRoom, incrementInteraction]);

  const disconnect = useCallback(() => {
    addNeuralNode({ emotion: 'hope', text: 'Nexus peer connection', source: 'nexus', intensity: 0.5 });
    setTetheredRoom(null); setMessages([]); setStatus('idle'); setTimeLeft(null);
    if (timerRef.current) clearInterval(timerRef.current);
    socket.disconnect(); socket.connect();
  }, [addNeuralNode]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <motion.div
      className="nexus-page-nature"
      id="nexus-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45 }}
      style={{
        backgroundImage: `url(${bgForest})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
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
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(248, 250, 248, 0.4)', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>

      {/* Header */}
      <div className="view-header" style={{ width: '100%', maxWidth: 720, background: 'rgba(255,255,255,0.4)', padding: 'var(--sp-4)', borderRadius: 'var(--r-xl)', marginBottom: 'var(--sp-6)' }}>
        <div className="view-header-left">
          <div className="view-eyebrow" style={{ color: 'var(--primary-dark)' }}>🌌 &nbsp;Human Connection</div>
          <h1 className="view-title t-organic" id="nexus-title" style={{ color: 'var(--primary-dark)' }}>Nexus</h1>
          <p className="view-subtitle" style={{ color: 'var(--primary-dark)' }}>Anonymous, AI-moderated peer connection</p>
        </div>
        {status === 'connected' && timeLeft !== null && (
          <div className="nexus-time-badge" style={{ color: timeLeft < 60 ? 'var(--danger)' : 'var(--text-muted)' }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* ── IDLE / SEEKING ── */}
      <AnimatePresence mode="wait">
        {status !== 'connected' && (
          <motion.div
            key="waiting"
            className="nexus-waiting glass-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{ padding: 'var(--sp-8)', borderRadius: 'var(--r-2xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)', maxWidth: '600px', width: '100%' }}
          >
            {/* Cosmos orb with optional pulse */}
            <div className="nexus-orb-container">
              {status === 'seeking' && <>
                <div className="nexus-pulse-ring" />
                <div className="nexus-pulse-ring" />
                <div className="nexus-pulse-ring" />
              </>}
              <motion.div
                animate={status === 'seeking' ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <CosmosIllustration seeking={status === 'seeking'} />
              </motion.div>
            </div>

            {status === 'idle' && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 'var(--sp-3)' }}>
                    Enter the Nexus
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    Connect anonymously with another soul in the cosmos. Every conversation is AI-moderated, ephemeral, and completely private.
                  </p>
                </div>

                {/* Privacy badges */}
                <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['🔒 100% Anonymous', '🤖 AI Moderated', '⏱ 10 min sessions', '🚫 No data stored'].map((b) => (
                    <div key={b} className="pill pill-green" style={{ fontSize: '0.75rem' }}>{b}</div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button className="btn btn-primary btn-lg" onClick={sendPing} id="nexus-seek">
                    🔍 &nbsp;Seek Connection
                  </button>
                  {activePings.length > 0 && (
                    <button className="btn btn-secondary btn-lg" onClick={() => answerPing(activePings[0])} id="nexus-answer">
                      🤝 &nbsp;Answer Signal ({activePings.length})
                    </button>
                  )}
                </div>
              </>
            )}

            {status === 'seeking' && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 'var(--sp-3)' }}>
                    Sending Signal...
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    Your signal is pulsing through the neural network. Waiting for another consciousness to respond.
                  </p>
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {activePings.length} signal{activePings.length !== 1 ? 's' : ''} active in the Nexus
                </div>
                {activePings.length > 0 && (
                  <button className="btn btn-secondary" onClick={() => answerPing(activePings[0])}>
                    🤝 &nbsp;Answer Signal ({activePings.length})
                  </button>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ── CONNECTED CHAT ── */}
        {status === 'connected' && (
          <motion.div
            key="chat"
            className="nexus-chat-wrap glass-panel"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ maxHeight: 'calc(100vh - 240px)', minHeight: 400, width: '100%', maxWidth: '720px', borderRadius: 'var(--r-2xl)', display: 'flex', flexDirection: 'column' }}
          >
            {/* Chat header */}
            <div className="nexus-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <div className="nexus-status-dot" />
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                    Neural Link Active
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anonymous · AI moderated · {timeLeft !== null ? formatTime(timeLeft) : ''} remaining</div>
                </div>
              </div>
              <button className="btn btn-sm btn-ghost" onClick={disconnect} id="nexus-disconnect">
                Disconnect
              </button>
            </div>

            {/* Messages */}
            <div className="nexus-messages-list">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={msg.system ? 'nexus-msg-system' : msg.self ? 'nexus-msg-self' : 'nexus-msg-other'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="nexus-input-row">
              <input
                className="input"
                placeholder="Send a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                id="nexus-input"
                style={{ borderRadius: 'var(--r-full)', padding: 'var(--sp-3) var(--sp-5)' }}
              />
              <button
                className="btn btn-primary btn-icon"
                onClick={sendMessage}
                disabled={!input.trim()}
                id="nexus-send"
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
}
