import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Send, Bot, User } from 'lucide-react';

const AIChat = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi there 💚 I'm your AI companion on OkaySpace. I'm here to listen — no judgment, just support. How are you feeling today?" }
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
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please try again 💚" }]);
        } finally { setLoading(false); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', paddingTop: 0 }}>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Bot size={20} color="var(--green)" />
                <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Companion</h1>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>— always here, always kind</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: '0.6rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.role === 'user' ? '#1a1a1a' : 'var(--green-light)' }}>
                            {msg.role === 'user' ? <User size={15} color="white" /> : <Bot size={15} color="var(--green)" />}
                        </div>
                        <div style={{
                            maxWidth: '75%', padding: '0.75rem 1rem', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                            background: msg.role === 'user' ? '#1a1a1a' : 'white',
                            color: msg.role === 'user' ? 'white' : '#1a1a1a',
                            fontSize: '0.9rem', lineHeight: 1.6,
                            boxShadow: 'var(--shadow-sm)',
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--green-light)' }}>
                            <Bot size={15} color="var(--green)" />
                        </div>
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '4px 16px 16px 16px', background: 'white', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {[0, 0.2, 0.4].map((d, i) => (
                                <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ccc', animation: `spin ${0.6 + d}s ease-in-out infinite alternate` }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div style={{ padding: '1rem 1.5rem', background: 'white', borderTop: '1px solid var(--border)' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input type="text" value={input} onChange={e => setInput(e.target.value)}
                        placeholder="Share what's on your mind..." disabled={loading}
                        className="input-field" style={{ flex: 1 }} />
                    <button type="submit" disabled={loading || !input.trim()} className="btn-primary"
                        style={{ padding: '0.75rem 1rem', opacity: !input.trim() || loading ? 0.5 : 1 }}>
                        <Send size={17} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;
