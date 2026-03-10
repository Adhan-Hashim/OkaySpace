import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { X, Menu } from 'lucide-react';

const NAV_LINKS_GUEST = [
    { to: '/login', label: 'Sign In' },
    { to: '/signup', label: 'Join Us' },
];

const NAV_LINKS_USER = [
    { to: '/dashboard', label: 'Community' },
    { to: '/chat', label: 'AI Chat' },
    { to: '/mood', label: 'Mood' },
    { to: '/letters', label: 'Letters' },
    { to: '/therapists', label: 'Therapists' },
    { to: '/resources', label: 'Resources' },
    { to: '/emergency', label: 'Emergency' },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const links = user ? NAV_LINKS_USER : NAV_LINKS_GUEST;

    const handleLogout = () => {
        setOpen(false);
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Floating hamburger button — top right */}
            <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 10000,
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: '#1a1a1a',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s ease, background 0.2s ease',
                    color: '#fff',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Backdrop */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9998,
                        background: 'rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(2px)',
                    }}
                />
            )}

            {/* Slide-in panel */}
            <div style={{
                position: 'fixed',
                top: 0, right: 0,
                width: '280px',
                height: '100vh',
                zIndex: 9999,
                background: 'white',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
                transform: open ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex',
                flexDirection: 'column',
                padding: '5rem 2rem 2rem',
            }}>
                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1.4rem',
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        marginBottom: '2rem',
                        display: 'block',
                    }}
                >
                    Okay<span style={{ color: 'var(--green)' }}>Space</span>
                </Link>

                {/* Nav links */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                    {links.map(link => {
                        const active = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setOpen(false)}
                                style={{
                                    padding: '0.7rem 0.9rem',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: active ? 600 : 500,
                                    color: active ? 'var(--green)' : '#555',
                                    background: active ? 'var(--green-light)' : 'transparent',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={e => {
                                    if (!active) {
                                        e.currentTarget.style.background = '#f5f5f5';
                                        e.currentTarget.style.color = '#1a1a1a';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#555';
                                    }
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout / bottom actions */}
                {user && (
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1.25rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.75rem' }}>
                            Signed in as <strong style={{ color: '#555' }}>{user.name?.split(' ')[0]}</strong>
                        </p>
                        <button onClick={handleLogout} style={{
                            width: '100%', padding: '0.7rem', borderRadius: '10px',
                            background: '#f5f5f5', border: 'none', cursor: 'pointer',
                            color: '#555', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 500,
                            transition: 'background 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#ebebeb'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Navbar;
