import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SafeModeContext } from '../context/SafeModeContext';
import { Shield, ShieldOff, Menu } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isSafeMode, toggleSafeMode } = useContext(SafeModeContext);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{
            position: 'fixed',
            top: '4vh',
            left: '71vw', // Roughly the 25vw from the right position, but anchored from the left
            transform: 'translateX(-50%)', // This forces perfectly symmetrical expansion in both directions
            zIndex: 99999
        }}>
            <nav
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: 'var(--text-main)', // Dark Navy
                    borderRadius: '30px', /* Dynamic Island extreme radius */
                    display: 'flex',
                    alignItems: 'center',
                    padding: isHovered ? '0 20px' : '0',
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.8s cubic-bezier(0.5, 1.8, 0.2, 1)',
                    overflow: 'hidden',
                    maxWidth: isHovered ? '1200px' : '60px',
                    width: 'max-content',
                    minWidth: '60px',
                    height: '60px',
                    cursor: isHovered ? 'default' : 'pointer',
                    position: 'relative',
                    justifyContent: 'center'
                }}>
                {/* Collapsed Icon */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) scale(${isHovered ? 0.5 : 1})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isHovered ? 0 : 1,
                    transition: 'all 0.4s ease',
                    pointerEvents: 'none'
                }}>
                    <Menu color="var(--bg-color)" size={28} />
                </div>

                {/* Expanded Content */}
                <div style={{
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    letterSpacing: '0.5px',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'scale(1)' : 'scale(0.8)',
                    transition: 'all 0.8s cubic-bezier(0.5, 1.8, 0.2, 1)',
                    whiteSpace: 'nowrap',
                    pointerEvents: isHovered ? 'auto' : 'none',
                    position: 'relative', // Changed from absolute to relative to expand the container
                    width: 'max-content'
                }}>
                    <button
                        onClick={toggleSafeMode}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: isSafeMode ? 'var(--success)' : 'transparent',
                            color: isSafeMode ? 'var(--text-main)' : 'var(--bg-color)',
                            border: isSafeMode ? 'none' : '1px solid rgba(255,255,255,0.4)',
                            padding: '10px 20px',
                            borderRadius: '4px', /* Geometric */
                            cursor: 'pointer',
                            fontFamily: 'var(--font-accent)',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isSafeMode ? <Shield size={16} /> : <ShieldOff size={16} />}
                        {isSafeMode ? "SAFE MODE: ON" : "SAFE MODE: OFF"}
                    </button>
                    <a href="/#concerns" className="nav-link">CONCERNS</a>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">LEDGER</Link>
                            <Link to="/mood" className="nav-link">TRACK</Link>
                            <Link to="/chat" className="nav-link">LISTENER</Link>
                            <Link to="/letters" className="nav-link">LETTERS</Link>
                            <Link to="/therapists" className="nav-link">THERAPISTS</Link>
                            <Link to="/resources" className="nav-link">EDUCATION</Link>
                            <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                DISCONNECT
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">AUTHENTICATE</Link>
                            <Link to="/signup" className="nav-link active-link">ENTER VAULT</Link>
                        </>
                    )}
                </div>
            </nav>

            <style>{`
                .nav-link {
                    color: var(--bg-color);
                    text-decoration: none;
                    text-transform: uppercase;
                    padding: 10px 20px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                }
                .nav-link:hover {
                    background: rgba(255,255,255,0.1);
                }
                .active-link {
                    background: var(--accent);
                    color: white;
                }
                .active-link:hover {
                    background: #cc0000;
                }
            `}</style>
        </div >
    );
};

export default Navbar;
