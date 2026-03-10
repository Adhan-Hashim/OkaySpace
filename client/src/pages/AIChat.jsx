import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Bot, User, Terminal } from 'lucide-react';

const AIChat = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "SYSTEM_INITIALIZED: Greetings, seeker. I am your neural companion. I am calibrated to analyze your input with zero judgment. How is your trajectory today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput(''); setLoading(true);
        try {
            const res = await api.post('/ai/chat', { message: input });
            setMessages(prev => [...prev, res.data]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "ERROR_404: CONNECTION_INTERRUPTED_RETRY_MANDATORY_💚" }]);
        } finally { setLoading(false); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-deep)', paddingTop: '5rem' }}>
            {/* Header */}
            <div style={{ padding: '2rem 10%', borderBottom: '1px solid var(--border-line)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', border: '1px solid var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={20} color="var(--accent-teal)" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.25rem', letterSpacing: '0.1em' }}>NEURAL_INTERFACE_v1.0</h1>
                    <p className="text-technical" style={{ fontSize: '0.6rem', opacity: 0.5 }}>ACTIVE_SESSION // BIOMETRIC_IDENT: {user?.name?.toUpperCase()}</p>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '3rem 10%', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        gap: '1rem',
                        maxWidth: msg.role === 'user' ? '70%' : '100%',
                        marginLeft: msg.role === 'user' ? 'auto' : '0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span className="text-technical" style={{ fontSize: '0.55rem', opacity: 0.4 }}>
                                {msg.role === 'user' ? 'ENTITY_INPUT' : 'SYSTEM_RESPONSE'}
                            </span>
                        </div>
                        <div style={{
                            padding: '2rem',
                            border: '1px solid var(--border-line)',
                            background: msg.role === 'user' ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                            lineHeight: 1.8,
                            fontFamily: msg.role === 'assistant' ? 'var(--font-mono)' : 'var(--font-body)',
                            position: 'relative'
                        }}>
                            {msg.content}
                            {msg.role === 'assistant' && (
                                <div style={{ position: 'absolute', top: -1, left: -1, width: '10px', height: '10px', borderTop: '1px solid var(--accent-teal)', borderLeft: '1px solid var(--accent-teal)' }} />
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <span className="text-technical" style={{ fontSize: '0.55rem', opacity: 0.4 }}>SYSTEM_ANALYZING...</span>
                        <div style={{ width: '40px', height: '2px', background: 'var(--accent-teal)', animation: 'pulse 1.5s infinite' }} />
                    </div>
                )}
            </div>

            {/* Input */}
            <div style={{ padding: '3rem 10%', borderTop: '1px solid var(--border-line)', background: 'rgba(0,0,0,0.2)' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1.5rem', color: 'var(--accent-teal)' }}>
                        <Terminal size={16} />
                    </div>
                    <input type="text" value={input} onChange={e => setInput(e.target.value)}
                        placeholder="ENTER_THOUGHT_PROTOCOL..." disabled={loading}
                        style={{
                            flex: 1,
                            background: 'none',
                            border: '1px solid var(--border-line)',
                            padding: '1.25rem 1.5rem 1.25rem 3.5rem',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'border-color 0.3s ease'
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent-teal)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-line)'}
                    />
                    <button type="submit" disabled={loading || !input.trim()} className="btn-mindjoin"
                        style={{ padding: '1.25rem 2rem', background: 'var(--accent-teal)', color: '#000' }}>
                        [ TRANSMIT ]
                    </button>
                </form>
                <p className="text-technical" style={{ fontSize: '0.55rem', marginTop: '1.5rem', textAlign: 'center', opacity: 0.3 }}>
                    END_TO_END_NEURAL_ENCRYPTION_ENABLED // SESSION_ACTIVE
                </p>
            </div>
        </div>
    );
};

export default AIChat;
