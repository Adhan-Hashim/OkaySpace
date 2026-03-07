import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';

const Signup = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const formRef = useRef(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    useEffect(() => {
        if (containerRef.current && formRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
            gsap.fromTo(formRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }
            );
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign up');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - var(--nav-height))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            background: `linear-gradient(135deg, var(--bg-color) 0%, var(--secondary-bg) 100%)`
        }}>
            <div ref={containerRef} style={{
                width: '100%',
                maxWidth: '520px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '2px solid var(--text-main)',
                padding: '4rem 3rem',
                boxShadow: '0 20px 60px rgba(35, 31, 32, 0.1)'
            }}>
                <div ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{
                            fontSize: '3.5rem',
                            fontFamily: 'var(--font-accent)',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            margin: '0 0 0.5rem 0',
                            lineHeight: '1.1'
                        }}>Join OkaySpace</h1>
                        <p style={{
                            fontSize: '1.1rem',
                            color: '#666',
                            margin: '0.5rem 0 0 0',
                            fontFamily: 'var(--font-body)'
                        }}>Create your account to start your healing journey</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: '1rem 1.5rem',
                            background: '#FFE5E5',
                            border: '2px solid var(--danger)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <AlertCircle size={20} color='var(--danger)' />
                            <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Full Name Input */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-accent)',
                                marginBottom: '0.75rem',
                                color: 'var(--text-main)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Full Name</label>
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <User size={18} style={{
                                    position: 'absolute',
                                    left: '1.2rem',
                                    color: focusedInput === 'name' ? 'var(--accent)' : '#999',
                                    transition: 'color 0.3s'
                                }} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={() => setFocusedInput('name')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder="Your name"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 3rem',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-body)',
                                        border: focusedInput === 'name' ? '2px solid var(--accent)' : '2px solid #ddd',
                                        borderRadius: '12px',
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                        background: focusedInput === 'name' ? 'rgba(244, 139, 71, 0.05)' : '#fff'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-accent)',
                                marginBottom: '0.75rem',
                                color: 'var(--text-main)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Email Address</label>
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Mail size={18} style={{
                                    position: 'absolute',
                                    left: '1.2rem',
                                    color: focusedInput === 'email' ? 'var(--accent)' : '#999',
                                    transition: 'color 0.3s'
                                }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder="you@example.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 3rem',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-body)',
                                        border: focusedInput === 'email' ? '2px solid var(--accent)' : '2px solid #ddd',
                                        borderRadius: '12px',
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                        background: focusedInput === 'email' ? 'rgba(244, 139, 71, 0.05)' : '#fff'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-accent)',
                                marginBottom: '0.75rem',
                                color: 'var(--text-main)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Password</label>
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Lock size={18} style={{
                                    position: 'absolute',
                                    left: '1.2rem',
                                    color: focusedInput === 'password' ? 'var(--accent)' : '#999',
                                    transition: 'color 0.3s'
                                }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 3rem',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-body)',
                                        border: focusedInput === 'password' ? '2px solid var(--accent)' : '2px solid #ddd',
                                        borderRadius: '12px',
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                        background: focusedInput === 'password' ? 'rgba(244, 139, 71, 0.05)' : '#fff'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '1.2rem 2rem',
                                fontSize: '1rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-accent)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                background: loading ? '#ccc' : 'var(--mint-green)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: loading ? 'none' : '0 10px 30px rgba(65, 201, 150, 0.3)'\n                            }}\n                            onMouseEnter={(e) => !loading && (e.target.style.background = '#2ea975')}\n                            onMouseLeave={(e) => !loading && (e.target.style.background = 'var(--mint-green)')}\n                        >\n                            {loading ? '✓ Creating Account...' : <><UserPlus size={18} /> Create Account</>\n                        }\n                        </button>\n                    </form>\n\n                    {/* Footer */}\n                    <div style={{\n                        textAlign: 'center',\n                        paddingTop: '1.5rem',\n                        borderTop: '1px solid #eee'\n                    }}>\n                        <p style={{\n                            fontSize: '1rem',\n                            color: '#666',\n                            margin: '0 0 0.5rem 0',\n                            fontFamily: 'var(--font-body)'\n                        }}>Already have an account?</p>\n                        <Link to=\"/login\" style={{\n                            color: 'var(--accent)',\n                            textDecoration: 'none',\n                            fontWeight: 600,\n                            fontSize: '1rem',\n                            fontFamily: 'var(--font-accent)',\n                            transition: 'opacity 0.3s',\n                            cursor: 'pointer',\n                            borderBottom: '2px solid var(--accent)',\n                            paddingBottom: '2px'\n                        }}>Sign In</Link>\n                    </div>\n                </div>\n            </div>\n        </div>\n    );\n};\n\nexport default Signup;
