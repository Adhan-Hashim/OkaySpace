import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const ECHO_GREETING = {
  role: 'ai',
  text: "Hello. I'm Echo — your neural companion. I'm here to listen, reflect, and explore your thoughts with you. There's no judgment here, only understanding.\n\nYou can talk to me about anything, or switch to **Reframe Mode** to challenge a specific thought.",
};

const REFRAME_GREETING = {
  role: 'ai',
  text: "🔄 **Reframe Mode Active**\n\nShare a negative or distressing thought, and I'll help you examine it through the lens of cognitive behavioral therapy. I'll identify the cognitive distortion and guide you to a healthier perspective.",
};

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
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Show greeting on first render
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [echoMessages, echoIsTyping]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || echoIsTyping) return;

    setInput('');
    addEchoMessage({ role: 'user', text });
    incrementInteraction();
    setShowGreeting(false);
    setEchoTyping(true);

    try {
      const endpoint = echoMode === 'reframe'
        ? 'http://localhost:5000/api/ai/echo-reframe'
        : 'http://localhost:5000/api/ai/echo';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: echoMessages.slice(-10).map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          mode: echoMode,
        }),
      });

      const data = await res.json();

      addEchoMessage({
        role: 'ai',
        text: data.response,
        sentiment: data.sentiment,
        distortion: data.distortion,
      });

      // Update emotion state
      if (data.sentiment) {
        setEmotion(data.sentiment.emotion, data.sentiment.intensity);
        addNeuralNode({
          emotion: data.sentiment.emotion,
          text: text.slice(0, 100),
          source: 'echo',
          intensity: data.sentiment.intensity,
        });
      }
    } catch (err) {
      // Fallback response
      const fallbacks = [
        "I hear you. That's a meaningful observation. Can you tell me more about what's behind that feeling?",
        "Thank you for sharing that. It takes courage to express what's on your mind. What aspect of this feels most significant to you?",
        "I notice there's a lot of depth in what you're saying. What would it look like if you viewed this situation with complete self-compassion?",
        "That's an interesting perspective. Let me ask you — if your closest friend shared this exact thought with you, what would you say to them?",
        "I can sense this is important to you. Sometimes our strongest feelings point us toward what matters most. What values does this connect to?",
      ];
      addEchoMessage({
        role: 'ai',
        text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
        sentiment: { emotion: 'neutral', intensity: 0.5 },
      });
      setEmotion('neutral', 0.5);
      addNeuralNode({
        emotion: 'neutral',
        text: text.slice(0, 100),
        source: 'echo',
        intensity: 0.5,
      });
    }

    setEchoTyping(false);
  }, [input, echoIsTyping, echoMode, echoMessages, addEchoMessage, setEchoTyping, addNeuralNode, setEmotion, incrementInteraction]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleModeSwitch = (mode) => {
    setEchoMode(mode);
    setShowGreeting(true);
  };

  const currentGreeting = echoMode === 'reframe' ? REFRAME_GREETING : ECHO_GREETING;

  return (
    <div className="view-container echo-container" id="echo-view">
      {/* Header */}
      <motion.div
        className="view-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="heading-xl" id="echo-title">Echo</h1>
          <p className="text-caption" style={{ marginTop: '4px' }}>
            AI Neural Companion • {echoMode === 'reframe' ? 'Reframe Mode' : 'Companion Mode'}
          </p>
        </div>
      </motion.div>

      {/* Mode Selector */}
      <div className="echo-mode-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
        <button
          className={`btn ${echoMode === 'companion' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleModeSwitch('companion')}
          id="echo-mode-companion"
        >
          💬 Companion
        </button>
        <button
          className={`btn ${echoMode === 'reframe' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleModeSwitch('reframe')}
          id="echo-mode-reframe"
        >
          🔄 Reframe
        </button>
      </div>

      {/* Messages */}
      <div className="echo-messages" id="echo-messages">
        {/* Greeting */}
        {showGreeting && echoMessages.length === 0 && (
          <motion.div
            className="echo-msg-row ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
              <div className="echo-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                {currentGreeting.text}
              </div>
              <div className="text-caption" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
                ECHO • Neural Companion
              </div>
            </div>
          </motion.div>
        )}

        {/* Message History */}
        <AnimatePresence>
          {echoMessages.map((msg, i) => (
            <motion.div
              key={msg.id}
              className={`echo-msg-row ${msg.role === 'user' ? 'user' : 'ai'}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
                <div className="echo-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>
                <div className="text-caption" style={{ marginTop: '0.5rem', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'user' ? 'You' : 'ECHO'}
                  {msg.sentiment && (
                    <span style={{ marginLeft: '8px', color: 'var(--text-ghost)' }}>
                      • {msg.sentiment.emotion}
                    </span>
                  )}
                  {msg.distortion && (
                    <span style={{ marginLeft: '8px', color: 'var(--anxious-rose)' }}>
                      • {msg.distortion}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {echoIsTyping && (
          <motion.div
            className="echo-typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="echo-typing-dot" />
            <div className="echo-typing-dot" />
            <div className="echo-typing-dot" />
            <span style={{ marginLeft: '8px' }}>Echo is thinking...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="echo-input-area">
        <div className="echo-input-wrapper">
          <textarea
            ref={textareaRef}
            className="input-field"
            placeholder={
              echoMode === 'reframe'
                ? "Share a thought you'd like to reframe..."
                : "Share what's on your mind..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={echoIsTyping}
            rows={1}
            id="echo-input"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            className="btn btn-primary btn-icon"
            onClick={sendMessage}
            disabled={!input.trim() || echoIsTyping}
            id="echo-send-btn"
            aria-label="Send message"
            style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}
          >
            ↑
          </button>
        </div>
        <div className="text-caption" style={{ marginTop: '6px', textAlign: 'center' }}>
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
