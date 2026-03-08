import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { gsap } from 'gsap';
import ParticleBackground from '../components/ParticleBackground';

const Signup = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const formRef = useRef(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('default');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (containerRef.current && formRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
            );
            gsap.fromTo(formRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' }
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
        <>
            <ParticleBackground gender={gender} />
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem',
                position: 'relative',
                zIndex: 1
            }}>
                <div ref={containerRef} style={{
                    width: '100%',
                    maxWidth: '500px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '30px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    padding: '4.5rem 3rem',
                    boxShadow: '0 40px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Animated gradient background */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-50%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(65, 201, 150, 0.1) 0%, transparent 70%)',
                        animation: 'pulse 8s ease-in-out infinite',
                        pointerEvents: 'none'
                    }}></div>

                    <style>{`
                        @keyframes pulse {
                            0%, 100% { transform: translate(0, 0) scale(1); }
                            50% { transform: translate(30px, -30px) scale(1.1); }
                        }
                    `}</style>

                    <div ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <h1 style={{
                                fontSize: '3.5rem',
                                fontFamily: 'var(--font-accent)',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, var(--mint-green) 0%, #2ea975 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                margin: '0 0 0.5rem 0',
                                lineHeight: '1.1'
                            }}>Join Us</h1>
                            <p style={{
                                fontSize: '1rem',
                                color: '#888',
                                margin: '0.5rem 0 0 0',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 500
                            }}>Start your healing journey</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                padding: '1rem 1.5rem',
                                background: 'rgba(255, 107, 107, 0.1)',
                                border: '2px solid rgba(255, 107, 107, 0.5)',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <AlertCircle size={20} color='#FF6B6B' style={{ marginTop: '2px', flexShrink: 0 }} />
                                <span style={{ color: '#FF6B6B', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>{error}</span>
                            </div>
                        )}

                        {/* Full Name Input */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-accent)',
                                marginBottom: '0.75rem',
                                color: '#333',
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
                                    color: focusedInput === 'name' ? 'var(--mint-green)' : '#999',
                                    transition: 'color 0.3s',
                                    pointerEvents: 'none'
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
                                        border: focusedInput === 'name' ? '2px solid var(--mint-green)' : '2px solid #E0E0E0',
                                        borderRadius: '15px',
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                        background: focusedInput === 'name' ? 'rgba(65, 201, 150, 0.05)' : '#fff',
                                        boxShadow: focusedInput === 'name' ? '0 10px 30px rgba(65, 201, 150, 0.1)' : 'none'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-accent)',
                                marginBottom: '0.75rem',
                                color: '#333',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Email</label>
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Mail size={18} style={{
                                    position: 'absolute',
                                    left: '1.2rem',
                                    color: focusedInput === 'email' ? 'var(--mint-green)' : '#999',
                                    transition: 'color 0.3s',
                                    pointerEvents: 'none'
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
                                        border: focusedInput === 'email' ? '2px solid var(--mint-green)' : '2px solid #E0E0E0',
                                        borderRadius: '15px',
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                        background: focusedInput === 'email' ? 'rgba(65, 201, 150, 0.05)' : '#fff',
                                        boxShadow: focusedInput === 'email' ? '0 10px 30px rgba(65, 201, 150, 0.1)' : 'none'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-accent)',
                                marginBottom: '0.75rem',
                                color: '#333',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Particle Form</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-body)',
                                    border: '2px solid #E0E0E0',
                                    borderRadius: '15px',
                                    outline: 'none',
                                    background: '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    appearance: 'none',
                                    paddingRight: '2.5rem',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--mint-green)'}
                                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                            >
                                <option value="default">Neutral Form</option>
                                <option value="male">Blue Cubes (Male)</option>
                                <option value="female">Pink Spheres (Female)</option>
                            </select>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-accent)',
                                marginBottom: '0.75rem',
                                color: '#333',
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
                                    color: focusedInput === 'password' ? 'var(--mint-green)' : '#999',
                                    transition: 'color 0.3s',
                                    pointerEvents: 'none'
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem 3.5rem 1rem 3rem',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-body)',
                                        border: focusedInput === 'password' ? '2px solid var(--mint-green)' : '2px solid #E0E0E0',
                                        borderRadius: '15px',
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                        background: focusedInput === 'password' ? 'rgba(65, 201, 150, 0.05)' : '#fff',
                                        boxShadow: focusedInput === 'password' ? '0 10px 30px rgba(65, 201, 150, 0.1)' : 'none'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1.2rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#999',
                                        transition: 'color 0.3s',
                                        padding: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--mint-green)'}
                                    onMouseLeave={(e) => e.target.style.color = '#999'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={handleSubmit}
                            style={{
                                padding: '1.2rem 2rem',
                                fontSize: '1rem',
                                fontWeight: 700,
                                fontFamily: 'var(--font-accent)',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                background: loading ? '#ccc' : 'linear-gradient(135deg, var(--mint-green) 0%, #2ea975 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: loading ? 'none' : '0 15px 40px rgba(65, 201, 150, 0.35)',
                                marginTop: '0.5rem',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                        >
                            {loading ? '✓ Creating Account...' : <><UserPlus size={18} /> Create Account</>}
                        </button>

                        {/* Divider */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            margin: '0.5rem 0'
                        }}>
                            <div style={{ flex: 1, height: '1px', background: '#E0E0E0' }}></div>
                            <span style={{ color: '#999', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: '#E0E0E0' }}></div>
                        </div>

                        {/* Footer */}
                        <div>
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#666',
                                margin: '0 0 0.5rem 0',
                                fontFamily: 'var(--font-body)',
                                textAlign: 'center'
                            }}>Already have an account?</p>
                            <Link to="/login" style={{
                                display: 'block',
                                textAlign: 'center',
                                color: 'var(--accent)',
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '1rem',
                                fontFamily: 'var(--font-accent)',
                                transition: 'opacity 0.3s',
                                cursor: 'pointer'
                            }}>Sign In →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
