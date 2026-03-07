import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AIChat = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "SYSTEM INITIALIZED. I AM YOUR AUTOMATED LISTENER. HOW MAY I ASSIST YOUR EMOTIONAL BALANCE TODAY?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/chat', { message: input });
            setMessages(prev => [...prev, res.data]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "NETWORK ERROR. PLEASE RETRY." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '4vw', maxWidth: '900px', margin: '0 auto', height: 'calc(100vh - var(--nav-height))', display: 'flex', flexDirection: 'column' }}>

            <div style={{ borderBottom: '4px solid var(--text-main)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h2 className="heading-lg" style={{ fontSize: '3rem', margin: 0 }}>AI TERMINAL</h2>
                <span style={{ fontFamily: 'var(--font-accent)', letterSpacing: '2px' }}>NEURAL SUPPORT LINK</span>
            </div>

            <div style={{ flex: 1, border: '4px solid var(--text-main)', background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '12px 12px 0px var(--accent)' }}>

                {/* Chat Area */}
                <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            border: '2px solid var(--text-main)',
                            padding: '1.5rem',
                            background: msg.role === 'user' ? 'var(--text-main)' : 'var(--bg-color)',
                            color: msg.role === 'user' ? 'var(--bg-color)' : 'var(--text-main)'
                        }}>
                            <div style={{ fontFamily: 'var(--font-accent)', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
                                {msg.role === 'user' ? `CLIENT: ${user?.name}` : 'SYS: AI_LISTENER'}
                            </div>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', lineHeight: 1.6, textTransform: msg.role === 'user' ? 'none' : 'uppercase' }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ alignSelf: 'flex-start', border: '2px solid var(--accent)', padding: '1rem', background: 'var(--bg-color)', fontFamily: 'var(--font-accent)' }}>
                            PROCESSING DATA...
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div style={{ padding: '1.5rem', borderTop: '4px solid var(--text-main)', background: 'var(--secondary-bg)' }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            className="input-brutalist"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="ENTER TRANSMISSION..."
                            style={{ background: 'white' }}
                            disabled={loading}
                        />
                        <button type="submit" className="btn-brutalist" disabled={loading || !input.trim()}>
                            TRANSMIT
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AIChat;
