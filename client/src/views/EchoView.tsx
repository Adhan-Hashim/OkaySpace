import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import api from '../api';
import bgLake from '../assets/bg-lake.png';

const ECHO_GREETING = {
  role: 'ai',
  text: "Hello, I'm Echo — your neural companion. I'm here to listen, reflect, and explore your thoughts with you. There's no judgment here, only understanding.\n\nTalk about anything on your mind, or switch to Reframe Mode to challenge a specific thought with CBT.",
};

const REFRAME_GREETING = {
  role: 'ai',
  text: "🔄 Reframe Mode is active.\n\nShare a negative or distressing thought, and I'll help you examine it through cognitive behavioral therapy — identifying the distortion and guiding you toward a healthier perspective.",
};

// Echo AI avatar SVG
function EchoAvatar({ size = 40 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #7FB69D, #5FA8A5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, boxShadow: '0 2px 8px rgba(127,182,157,0.35)',
    }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="5" fill="white" opacity="0.9"/>
        <path d="M11 3 Q14 7 11 11 Q8 7 11 3Z" fill="white" opacity="0.55"/>
        <path d="M19 11 Q15 14 11 11 Q15 8 19 11Z" fill="white" opacity="0.55"/>
        <path d="M11 19 Q8 15 11 11 Q14 15 11 19Z" fill="white" opacity="0.55"/>
        <path d="M3 11 Q7 8 11 11 Q7 14 3 11Z" fill="white" opacity="0.55"/>
      </svg>
    </div>
  );
}

export default function EchoView() {
  const echoMessages = useStore((s) => s.echoMessages);
  const addEchoMessage = useStore((s) => s.addEchoMessage);
  const echoMode = useStore((s) => s.echoMode);
  const setEchoMode = useStore((s) => s.setEchoMode);
  const echoIsTyping = useStore((s) => s.echoIsTyping);
  const setEchoTyping = useStore((s) => s.setEchoTyping);
  const addNeuralNode = useStore((s) => s.addNeuralNode);
  const setEmotion = useStore((s) => s.setEmotion);
  const incrementInteraction = useStore((s) => s.incrementInteraction);

  const [input, setInput] = useState('');
  const [showGreeting, setShowGreeting] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [echoMessages, echoIsTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || echoIsTyping) return;

    setInput('');
    addEchoMessage({ role: 'user', text });
    incrementInteraction();
    setShowGreeting(false);
    setEchoTyping(true);

    try {
      const endpoint = echoMode === 'reframe' ? '/ai/echo-reframe' : '/ai/echo';
      const res = await api.post(endpoint, {
        message: text,
        history: echoMessages.slice(-10).map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
        mode: echoMode,
      });

      const data = res.data;
      addEchoMessage({ role: 'ai', text: data.response, sentiment: data.sentiment, distortion: data.distortion });

      if (data.sentiment) {
        setEmotion(data.sentiment.emotion, data.sentiment.intensity);
        addNeuralNode({ emotion: data.sentiment.emotion, text: text.slice(0, 100), source: 'echo', intensity: data.sentiment.intensity });
      }
    } catch {
      const fallbacks = [
        "I hear you. That's a meaningful observation. Can you tell me more about what's behind that feeling?",
        "Thank you for sharing that. It takes courage to express what's on your mind. What aspect of this feels most significant to you?",
        "I notice there's depth in what you're saying. What would it look like if you viewed this situation with complete self-compassion?",
        "That's interesting. If your closest friend shared this thought, what would you say to them?",
        "I can sense this is important to you. What values does this connect to for you?",
      ];
      addEchoMessage({ role: 'ai', text: fallbacks[Math.floor(Math.random() * fallbacks.length)], sentiment: { emotion: 'neutral', intensity: 0.5 } });
      setEmotion('neutral', 0.5);
      addNeuralNode({ emotion: 'neutral', text: text.slice(0, 100), source: 'echo', intensity: 0.5 });
    }

    setEchoTyping(false);
  }, [input, echoIsTyping, echoMode, echoMessages, addEchoMessage, setEchoTyping, addNeuralNode, setEmotion, incrementInteraction]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleModeSwitch = (mode: string) => {
    setEchoMode(mode);
    setShowGreeting(true);
  };

  const currentGreeting = echoMode === 'reframe' ? REFRAME_GREETING : ECHO_GREETING;

  return (
    <motion.div
      className="echo-page-nature"
      id="echo-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundImage: `url(${bgLake})`,
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
      
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
        <div className="view-header-left" style={{ marginBottom: 0 }}>
          <div className="view-eyebrow" style={{ color: 'var(--primary-dark)', background: 'rgba(255,255,255,0.5)' }}>💬 &nbsp;AI Companion</div>
          <h1 className="view-title t-organic" style={{ color: 'var(--primary-dark)', textShadow: '0 2px 4px rgba(255,255,255,0.5)' }}>Echo</h1>
        </div>
        {/* Mode switcher */}
        <div className="echo-mode-bar">
          <button
            className={`echo-mode-btn${echoMode === 'companion' ? ' active' : ''}`}
            onClick={() => handleModeSwitch('companion')}
            id="echo-mode-companion"
          >
            💬 Companion
          </button>
          <button
            className={`echo-mode-btn${echoMode === 'reframe' ? ' active' : ''}`}
            onClick={() => handleModeSwitch('reframe')}
            id="echo-mode-reframe"
          >
            🔄 Reframe
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="echo-messages-wrap" id="echo-messages">
        {/* Greeting */}
        <AnimatePresence>
          {showGreeting && echoMessages.length === 0 && (
            <motion.div
              className="echo-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              <EchoAvatar />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', maxWidth: '80%' }}>
                <div className="echo-bubble echo-bubble-ai">{currentGreeting.text}</div>
                <div className="echo-meta">Echo · Neural Companion</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <AnimatePresence>
          {echoMessages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`echo-row${msg.role === 'user' ? ' user' : ''}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role !== 'user' && <EchoAvatar />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', maxWidth: '80%' }}>
                <div className={`echo-bubble ${msg.role === 'user' ? 'echo-bubble-user' : 'echo-bubble-ai'}`}
                  style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>
                <div className="echo-meta" style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'user' ? 'You' : 'Echo'}
                  {msg.sentiment && <span style={{ marginLeft: '6px', opacity: 0.6 }}>· {msg.sentiment.emotion}</span>}
                  {msg.distortion && <span style={{ marginLeft: '6px', color: 'var(--warning)' }}>· {msg.distortion}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing dots */}
        {echoIsTyping && (
          <motion.div className="echo-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EchoAvatar />
            <div className="echo-typing">
              <div className="echo-dot" />
              <div className="echo-dot" />
              <div className="echo-dot" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="echo-input-area">
        <div className="echo-input-row">
          <textarea
            ref={textareaRef}
            className="echo-textarea"
            placeholder={echoMode === 'reframe' ? "Share a thought to reframe..." : "Share what's on your mind..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={echoIsTyping}
            rows={1}
            id="echo-input"
          />
          <button
            className="btn btn-primary btn-icon"
            onClick={sendMessage}
            disabled={!input.trim() || echoIsTyping}
            id="echo-send-btn"
            aria-label="Send message"
          >
            ↑
          </button>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--primary-dark)', textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
          Enter to send &nbsp;·&nbsp; Shift + Enter for new line
        </div>
      </div>
      </div>
    </motion.div>
  );
}
