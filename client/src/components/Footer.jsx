import React from 'react';
import Magnetic from './Magnetic';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="main-footer" style={{
            background: 'var(--text-main)',
            color: 'var(--bg-color)',
            padding: '8vw 4vw 4vw',
            position: 'relative',
            zIndex: 10,
            borderTop: '6px solid var(--bg-color)'
        }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

                {/* Massive CTA Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h2 className="display-text" style={{ fontSize: 'clamp(5rem, 15vw, 20rem)', lineHeight: 0.8, marginBottom: '2rem', color: 'var(--bg-color)' }}>
                        READY TO<br />
                        <span style={{ color: 'transparent', WebkitTextStroke: '4px var(--bg-color)' }}>DEPOSIT?</span>
                    </h2>

                    <Magnetic>
                        <Link to="/signup" className="btn-brutalist" data-cursor="hover" style={{
                            background: 'var(--bg-color)',
                            color: 'var(--text-main)',
                            border: '4px solid var(--bg-color)',
                            fontSize: '2rem',
                            padding: '1.5rem 4rem',
                            borderRadius: '100px'
                        }}>
                            ENTER THE VAULT
                        </Link>
                    </Magnetic>
                </div>

                {/* Footer Links & Credits */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    borderTop: '4px solid var(--bg-color)',
                    paddingTop: '2rem',
                    fontFamily: 'var(--font-accent)',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '1.2rem' }}>
                        <Magnetic>
                            <a href="#" style={{ color: 'var(--bg-color)', textDecoration: 'none', textTransform: 'uppercase' }} data-cursor="hover">Privacy</a>
                        </Magnetic>
                        <Magnetic>
                            <a href="#" style={{ color: 'var(--bg-color)', textDecoration: 'none', textTransform: 'uppercase' }} data-cursor="hover">Terms</a>
                        </Magnetic>
                        <Magnetic>
                            <a href="#" style={{ color: 'var(--bg-color)', textDecoration: 'none', textTransform: 'uppercase' }} data-cursor="hover">Contact</a>
                        </Magnetic>
                    </div>

                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        © {new Date().getFullYear()} OKAYSPACE. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
