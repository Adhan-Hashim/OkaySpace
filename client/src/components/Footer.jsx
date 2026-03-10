import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ id }) => {
    return (
        <footer id={id} style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', background: 'white' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                    Okay<span style={{ color: 'var(--green)' }}>Space</span>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                    A safe space for everyone. All sharing is anonymous and confidential.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {[{ to: '/emergency', label: 'Emergency' }, { to: '/resources', label: 'Resources' }].map(l => (
                        <Link key={l.to} to={l.to} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#1a1a1a'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
