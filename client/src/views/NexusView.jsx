import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import useStore from '../store/useStore';

const socket = io('http://localhost:5000', { autoConnect: false });

const AI_PROMPTS = [
  "What's something that made you smile recently?",
  "If you could describe your current state in one color, what would it be?",
  "What's one kind thing you did for yourself today?",
  "What would you tell your younger self right now?",
  "What's a small victory you've had this week?",
  "If your feelings were weather, what's the forecast?",
];

export default function NexusView() {
  const addNeuralNode = useStore((s) => s.addNeuralNode);
  const incrementInteraction = useStore((s) => s.incrementInteraction);

  const [status, setStatus] = useState('idle'); // idle | seeking | helping | connected
  const [messages, setMessages] = useState([]);
  const [tetheredRoom, setTetheredRoom] = useState(null);
  const [activePings, setActivePings] = useState([]);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    socket.connect();

    socket.on('active_pings', (pings) => {
      setActivePings(pings.filter((id) => id !== socket.id));
    });

    socket.on('tethered', ({ room }) => {
      setTetheredRoom(room);
      setStatus('connected');
      setTimeLeft(600); // 10 min connection
      setMessages([{
        id: Date.now(),
        text: 'Neural link established. You are now connected anonymously.',
        system: true,
      }]);

      // AI prompt after 5 seconds
      setTimeout(() => {
        const prompt = AI_PROMPTS[Math.floor(Math.random() * AI_PROMPTS.length)];
        setMessages((prev) => [...prev, {
          id: Date.now(),
          text: `💡 Conversation prompt: "${prompt}"`,
          system: true,
        }]);
      }, 5000);
    });

    socket.on('receive_message', ({ text }) => {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        text,
        self: false,
      }]);
    });

    socket.on('tether_snapped', () => {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        text: 'The neural link has been severed.',
        system: true,
      }]);
      setTimeout(() => {
        setTetheredRoom(null);
        setMessages([]);
        setStatus('idle');
        setTimeLeft(null);
      }, 3000);
    });

    return () => {
      socket.off('active_pings');
      socket.off('tethered');
      socket.off('receive_message');
      socket.off('tether_snapped');
      socket.disconnect();
    };
  }, []);

  // Connection timer
  useEffect(() => {
    if (status !== 'connected' || timeLeft === null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          disconnect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [status, timeLeft]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendPing = useCallback(() => {
    setStatus('seeking');
    socket.emit('sonar_ping');
  }, []);

  const answerPing = useCallback((seekerId) => {
    socket.emit('answer_ping', seekerId);
  }, []);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || !tetheredRoom) return;
    socket.emit('send_message', { room: tetheredRoom, text });
    setMessages((prev) => [...prev, { id: Date.now(), text, self: true }]);
    setInput('');
    incrementInteraction();
  }, [input, tetheredRoom, incrementInteraction]);

  const disconnect = useCallback(() => {
    addNeuralNode({
      emotion: 'hope',
      text: 'Nexus peer connection',
      source: 'nexus',
      intensity: 0.5,
    });
    setTetheredRoom(null);
    setMessages([]);
    setStatus('idle');
    setTimeLeft(null);
    if (timerRef.current) clearInterval(timerRef.current);
    socket.disconnect();
    socket.connect();
  }, [addNeuralNode]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="view-container nexus-container" id="nexus-view">
      {/* Header */}
      <motion.div
        className="view-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="heading-xl" id="nexus-title">Nexus</h1>
          <p className="text-caption" style={{ marginTop: '4px' }}>
            Anonymous AI-Moderated Peer Connection
          </p>
        </div>
        {status === 'connected' && timeLeft !== null && (
          <div className="text-mono" style={{ color: timeLeft < 60 ? 'var(--alert-red)' : 'var(--text-muted)' }}>
            {formatTime(timeLeft)}
          </div>
        )}
      </motion.div>

      {/* Idle / Seeking State */}
      {status !== 'connected' && (
        <div className="nexus-waiting">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            {status === 'idle' && (
              <>
                <div className="nexus-orb">
                  <span style={{ fontSize: '2rem' }}>🌌</span>
                </div>
                <h2 className="heading-lg" style={{ marginTop: '1.5rem' }}>
                  Enter the Nexus
                </h2>
                <p className="text-body" style={{ maxWidth: '400px', margin: '0.5rem auto 2rem' }}>
                  Connect anonymously with another soul in the cosmos.
                  All conversations are AI-moderated for safety.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={sendPing} id="nexus-seek">
                    🔍 Seek Connection
                  </button>
                  {activePings.length > 0 && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => answerPing(activePings[0])}
                      id="nexus-answer"
                    >
                      🤝 Answer Signal ({activePings.length})
                    </button>
                  )}
                </div>
              </>
            )}

            {status === 'seeking' && (
              <>
                <motion.div
                  className="nexus-orb"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ borderColor: 'var(--pulse-pink)' }}
                >
                  <span style={{ fontSize: '2rem' }}>📡</span>
                </motion.div>
                <h2 className="heading-lg" style={{ marginTop: '1.5rem' }}>
                  Sending Signal...
                </h2>
                <p className="text-body" style={{ maxWidth: '400px', margin: '0.5rem auto 1rem' }}>
                  Your signal is pulsing through the neural network.
                  Waiting for another consciousness to respond.
                </p>
                <div className="text-mono" style={{ fontSize: '0.75rem' }}>
                  {activePings.length} signals active in the nexus
                </div>
              </>
            )}

            {status === 'helping' && activePings.length > 0 && (
              <>
                <div className="nexus-orb" style={{ borderColor: 'var(--calm-green)' }}>
                  <span style={{ fontSize: '2rem' }}>🤲</span>
                </div>
                <h2 className="heading-lg" style={{ marginTop: '1.5rem' }}>
                  Signals Detected
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
                  {activePings.map((pingId) => (
                    <button
                      key={pingId}
                      className="btn btn-secondary"
                      onClick={() => answerPing(pingId)}
                    >
                      🔗 Connect
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Connected Chat */}
      {status === 'connected' && (
        <motion.div
          className="nexus-chat glass"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="chat-header">
            <div>
              <h3 className="heading-md" style={{ color: 'var(--text-primary)' }}>
                Neural Link Active
              </h3>
              <p className="text-caption">Anonymous connection • AI moderated</p>
            </div>
            <button className="btn btn-secondary" onClick={disconnect} id="nexus-disconnect" style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}>
              Disconnect
            </button>
          </div>

          <div className="nexus-messages">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`nexus-msg ${msg.system ? 'system' : msg.self ? 'self' : 'other'}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.text}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="nexus-input-row">
            <input
              className="input-field"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              id="nexus-input"
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={!input.trim()}
              id="nexus-send"
              style={{ padding: '0 1rem' }}
            >
              ↑
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
