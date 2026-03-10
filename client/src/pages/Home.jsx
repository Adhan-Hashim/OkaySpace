import { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const { user } = useContext(AuthContext);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax backgrounds
            gsap.utils.toArray('.parallax-bg').forEach((bg, i) => {
                gsap.to(bg, {
                    yPercent: 20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: bg.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                });
            });

            // Text entrance animations
            gsap.utils.toArray('.reveal-text').forEach((text) => {
                gsap.from(text, {
                    y: 50,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: text,
                        start: 'top 85%',
                    }
                });
            });

            // Feature cards staggered entrance
            gsap.from('.feature-card', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.features-grid',
                    start: 'top 70%',
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} style={{ background: 'var(--bg-deep)', overflowX: 'hidden' }}>

            {/* Hero Section */}
            <section className="scroll-section" style={{ borderBottom: '1px solid var(--border-line)' }}>
                <div className="parallax-bg" style={{
                    background: 'radial-gradient(circle at 50% 50%, #002b2e 0%, #050505 70%)',
                    opacity: 0.8
                }} />

                <div style={{ textAlign: 'center', zIndex: 10 }}>
                    <p className="text-technical reveal-text" style={{ marginBottom: '2rem' }}>
                        [ CONNECTION_INITIATED // SYSTEM_READY ]
                    </p>
                    <h1 className="reveal-text" style={{
                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                        lineHeight: 0.9,
                        marginBottom: '1.5rem',
                    }}>
                        OKAY<br /><span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>SPACE</span>
                    </h1>
                    <p className="reveal-text" style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto 3rem',
                        lineHeight: 1.8
                    }}>
                        A technical sanctuary for the mind. Where anonymity meets empathy, and data-driven insight empowers human healing.
                    </p>
                    <div className="reveal-text">
                        <Link to={user ? "/dashboard" : "/signup"} className="btn-mindjoin">
                            {user ? 'Enter Workspace' : 'Initialize Protocol'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Architecture Section (Features) */}
            <section className="scroll-section" style={{ minHeight: '120vh' }}>
                <div className="parallax-bg" style={{
                    background: 'linear-gradient(180deg, #050505 0%, #001a1d 100%)'
                }} />

                <div className="container">
                    <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
                        <p className="text-technical" style={{ marginBottom: '1rem' }}>ARCHITECTURE_OVERVIEW</p>
                        <h2 style={{ fontSize: '3rem' }}>SYSTEM CAPABILITIES</h2>
                    </div>

                    <div className="features-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '2px', /* Technical grid lines */
                        background: 'var(--border-line)',
                        border: '1px solid var(--border-line)'
                    }}>
                        {[
                            { id: '01', title: 'ANONYMOUS_VOID', desc: 'Secure, encrypted sharing protocols to protect your identity in the mental collective.' },
                            { id: '02', title: 'NEURAL_LISTENER', desc: 'Advanced AI listeners available 24/7 for immediate cognitive processing and support.' },
                            { id: '03', title: 'MIND_METRICS', desc: 'Real-time mood tracking and pattern recognition to visualize your emotional trajectory.' },
                            { id: '04', title: 'EMPATHY_BUFFER', desc: 'Send and receive digital letters of support through our curated kindness gateway.' }
                        ].map((f) => (
                            <div key={f.id} className="feature-card" style={{
                                background: 'var(--bg-deep)',
                                padding: '4rem 3rem',
                                position: 'relative'
                            }}>
                                <span className="text-technical" style={{ fontSize: '0.6rem', position: 'absolute', top: '2rem', left: '3rem' }}>
                                    MODULE_{f.id}
                                </span>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="scroll-section" style={{ minHeight: '80vh' }}>
                <div className="parallax-bg" style={{
                    background: 'radial-gradient(circle at 50% 100%, #1a001a 0%, #050505 80%)',
                    opacity: 0.5
                }} />

                <div style={{ textAlign: 'center', zIndex: 10 }}>
                    <p className="text-technical reveal-text" style={{ marginBottom: '2rem' }}>TERMINAL_END</p>
                    <h2 className="reveal-text" style={{ fontSize: '4rem', marginBottom: '3rem' }}>READY TO SYNC?</h2>
                    <div className="reveal-text" style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                        {!user && (
                            <Link to="/signup" className="btn-mindjoin" style={{ background: 'var(--accent-teal)', color: '#000' }}>
                                Create Identity
                            </Link>
                        )}
                        <Link to="/resources" className="btn-mindjoin" style={{ background: 'transparent', border: '1px solid var(--text-primary)', color: 'var(--text-primary)' }}>
                            Read Documentation
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Padding for Dispersed Nav */}
            <div style={{ height: '10rem' }} />
        </div>
    );
};

export default Home;
