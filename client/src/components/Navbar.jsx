import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItemStyle = {
        position: 'fixed',
        zIndex: 10001,
        textDecoration: 'none',
        transition: 'color 0.3s ease, transform 0.3s ease',
    };

    return (
        <>
            {/* Top Left: COMMUNE */}
            <Link
                to={user ? "/dashboard" : "/login"}
                className="text-technical"
                style={{
                    ...navItemStyle,
                    top: '2.5rem',
                    left: '2.5rem',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
                [ COMMUNE ]
            </Link>

            {/* Top Center: CORE */}
            <Link
                to="/"
                style={{
                    ...navItemStyle,
                    top: '2.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    letterSpacing: '0.3em',
                    color: 'var(--text-primary)',
                }}
            >
                OKAYSPACE
            </Link>

            {/* Top Right: INSIGHT */}
            <Link
                to="/resources"
                className="text-technical"
                style={{
                    ...navItemStyle,
                    top: '2.5rem',
                    right: '2.5rem',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
                [ INSIGHT ]
            </Link>

            {/* Middle Left: CALIBRATE */}
            <Link
                to="/breath"
                className="text-technical"
                style={{
                    ...navItemStyle,
                    top: '50%',
                    left: '2.5rem',
                    transform: 'translateY(-50%)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) translateX(5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) translateX(0)'}
            >
                [ CALIBRATE ]
            </Link>

            {/* Middle Right: VOID */}
            <Link
                to="/zen"
                className="text-technical"
                style={{
                    ...navItemStyle,
                    top: '50%',
                    right: '2.5rem',
                    transform: 'translateY(-50%)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) translateX(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) translateX(0)'}
            >
                [ VOID ]
            </Link>

            {/* Bottom Right: AUTH / EXIT */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '2.5rem',
                    right: '2.5rem',
                    zIndex: 10001,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.5rem'
                }}
            >
                {user ? (
                    <>
                        <p className="text-technical" style={{ fontSize: '0.6rem', opacity: 0.5 }}>
                            USER_ID: {user.name?.split(' ')[0].toUpperCase()}
                        </p>
                        <button
                            onClick={handleLogout}
                            className="text-technical"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--accent-magenta)',
                                padding: 0
                            }}
                        >
                            [ DISCONNECT ]
                        </button>
                    </>
                ) : (
                    <Link
                        to="/signup"
                        className="text-technical"
                        style={{ color: 'var(--accent-teal)' }}
                    >
                        [ INITIALIZE ]
                    </Link>
                )}
            </div>

            {/* Side Branding - Vertical */}
            <div
                className="text-technical"
                style={{
                    position: 'fixed',
                    left: '2.5rem',
                    bottom: '2.5rem',
                    zIndex: 10001,
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    opacity: 0.3
                }}
            >
                MIND_SYNC_ACTIVE // VER 0.4.2
            </div>
        </>
    );
};

export default Navbar;
