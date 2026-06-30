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
        setMessages((prev) => [...prev, { id: Date.now(), text: ` "${prompt}"`, system: true }]);
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
      className="vd-page-bg vd-page-wrapper"
      id="nexus-view"
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
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div className="view-header" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-8)', borderBottom: '2px solid #000000', paddingBottom: 'var(--sp-4)' }}>
          <div className="view-header-left">
            <h1 className="vd-title-large">NEXUS</h1>
            <p className="vd-subtitle">Anonymous, AI-moderated peer connection</p>
          </div>
          {status === 'connected' && timeLeft !== null && (
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1rem', fontWeight: 'bold', color: timeLeft < 60 ? '#ff3b30' : '#000000' }}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* ── IDLE / SEEKING ── */}
        <AnimatePresence mode="wait">
          {status !== 'connected' && (
            <motion.div
              key="waiting"
              className="vd-card-flat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)', maxWidth: '600px', width: '100%' }}
            >
              {/* Sonar seeking visual */}
              <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                {status === 'seeking' && (
                  <>
                    <div style={{
                      position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
                      border: '2px solid #000000', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                    }} />
                    <div style={{
                      position: 'absolute', width: '70%', height: '70%', borderRadius: '50%',
                      border: '2px solid #000000', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s',
                    }} />
                  </>
                )}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#000000',
                  animation: status === 'seeking' ? 'pulse 1.5s infinite ease-in-out' : 'none',
                }} />
              </div>

              {status === 'idle' && (
                <>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#000000', letterSpacing: '-0.02em', marginBottom: 'var(--sp-3)' }}>
                      ENTER THE NEXUS
                    </h2>
                    <p style={{ color: '#666666', maxWidth: '380px', lineHeight: 1.7, fontSize: '0.95rem', margin: '0 auto' }}>
                      Connect anonymously with another soul in the cosmos. Every conversation is AI-moderated, ephemeral, and completely private.
                    </p>
                  </div>

                  {/* Privacy badges */}
                  <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['100% Anonymous', 'AI Moderated', '10 min sessions', 'No data stored'].map((b) => (
                      <div key={b} style={{
                        padding: '0.25rem 0.75rem',
                        border: '1.5px solid #000000',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#000000',
                      }}>{b}</div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button className="vd-btn-pill" onClick={sendPing} id="nexus-seek">
                      Seek Connection
                    </button>
                    {activePings.length > 0 && (
                      <button className="vd-btn-pill-secondary" onClick={() => answerPing(activePings[0])} id="nexus-answer">
                        Answer Signal ({activePings.length})
                      </button>
                    )}
                  </div>
                </>
              )}

              {status === 'seeking' && (
                <>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#000000', letterSpacing: '-0.02em', marginBottom: 'var(--sp-3)' }}>
                      SENDING SIGNAL...
                    </h2>
                    <p style={{ color: '#666666', maxWidth: '360px', lineHeight: 1.7, fontSize: '0.95rem', margin: '0 auto' }}>
                      Your signal is pulsing through the neural network. Waiting for another consciousness to respond.
                    </p>
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', color: '#666666', fontWeight: 'bold' }}>
                    {activePings.length} signal{activePings.length !== 1 ? 's' : ''} active in the Nexus
                  </div>
                  {activePings.length > 0 && (
                    <button className="vd-btn-pill-secondary" onClick={() => answerPing(activePings[0])}>
                      Answer Signal ({activePings.length})
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
              className="vd-card-flat"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ minHeight: 450, width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', padding: 'var(--sp-6)' }}
            >
              {/* Chat header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#34c759' }} />
                  <div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#000000' }}>
                      NEURAL LINK ACTIVE
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666666', fontWeight: 500 }}>
                      Anonymous · AI moderated · {timeLeft !== null ? formatTime(timeLeft) : ''} remaining
                    </div>
                  </div>
                </div>
                <button className="vd-btn-pill-secondary" onClick={disconnect} id="nexus-disconnect" style={{ minHeight: '35px', height: '35px', padding: '0 1rem', fontSize: '0.8rem' }}>
                  Disconnect
                </button>
              </div>

              {/* Messages list */}
              <div 
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-4)',
                  padding: 'var(--sp-4) 0',
                  maxHeight: 'calc(100vh - 400px)',
                  minHeight: '280px',
                }}
              >
                <AnimatePresence>
                  {messages.map((msg) => {
                    if (msg.system) {
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            color: '#666666',
                            fontWeight: 'bold',
                            padding: 'var(--sp-2) 0',
                          }}
                        >
                          {msg.text}
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={msg.self ? 'vd-chat-user-bubble' : 'vd-chat-ai-bubble'}
                      >
                        {msg.text}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input row */}
              <div style={{ borderTop: '2px solid #000000', paddingTop: 'var(--sp-4)', marginTop: 'auto' }}>
                <div className="vd-chat-input-row">
                  <input
                    className="vd-chat-textarea"
                    placeholder="Send an anonymous message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    id="nexus-input"
                    style={{ height: '38px', padding: '4px 0' }}
                  />
                  <button
                    className="vd-chat-send-btn"
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    id="nexus-send"
                  >
                    ↑
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Sonar seeking keyframes */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
      `}</style>
    </motion.div>
  );
}
