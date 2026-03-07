import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Home = () => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const exhibitRef = useRef(null);
    const concernsRef = useRef(null);
    const footerRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const sections = [heroRef.current, exhibitRef.current, concernsRef.current, footerRef.current];
        const bgColors = ['var(--bg-color)', 'var(--mint-green)', 'var(--accent)', 'var(--text-main)'];

        // ScrollTrigger to animate the main container's background color
        sections.forEach((sec, i) => {
            if (!sec) return;
            ScrollTrigger.create({
                trigger: sec,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => gsap.to(containerRef.current, { backgroundColor: bgColors[i], duration: 0.6 }),
                onEnterBack: () => gsap.to(containerRef.current, { backgroundColor: bgColors[i], duration: 0.6 }),
            });
        });

        // Hero Parallax text reveal
        gsap.fromTo(textRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        );

        // Slide up block reveal for exhibits and concerns
        const revealBlocks = gsap.utils.toArray('.reveal-block');
        revealBlocks.forEach(block => {
            gsap.fromTo(block,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: block,
                        start: "top 80%",
                    }
                }
            );
        });

        return () => {
            if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll) {
                ScrollTrigger.getAll().forEach(t => t.kill());
            }
        };
    }, []);

    const exhibits = [
        {
            title: "Encrypted\nSharing.",
            description: "A private vault to lock away your daily anxieties. No judgment, no traces. Pure unadulterated offloading.",
            color: "var(--light-blue)",
            textColor: "white"
        },
        {
            title: "AI\nCompanion.",
            description: "Our neural listeners are programmed to validate and compound your emotional growth. 24/7 active listening.",
            color: "transparent",
            textColor: "var(--text-main)",
            border: "1px solid var(--text-main)"
        },
        {
            title: "Community\nLedger.",
            description: "Witness the collective emotional currency of the platform. Anonymous, stark, and beautiful human nature.",
            color: "var(--secondary-bg)",
            textColor: "var(--text-main)"
        }
    ];

    const concerns = [
        "Anxiety & Stress",
        "Depression & Mood Disorder",
        "Trauma & PTSD",
        "Relationship Issues",
        "Grief Counselling",
        "Anger Management",
        "Queer Affirmative Concerns",
        "Work Stress & Burnout",
        "Parenting & Child Issues"
    ];

    return (
        <div ref={containerRef} style={{ backgroundColor: 'var(--bg-color)', transition: 'background-color 0.1s ease', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* HERO SECTION */}
            <section ref={heroRef} style={{ height: '90vh', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '5vw', paddingBottom: '10vh' }}>
                <div ref={textRef} style={{ maxWidth: '1200px' }}>
                    <h1 className="display-text" style={{ textTransform: 'none', lineHeight: 0.9 }}>
                        Okay Space.<br />
                        <span style={{ color: 'var(--accent)' }}>The safest place.</span>
                    </h1>
                    <p style={{ marginTop: '2rem', fontSize: '1.5rem', fontFamily: 'var(--font-body)', color: 'var(--text-main)', maxWidth: '600px', lineHeight: 1.6 }}>
                        A minimalist emotional support platform built for processing, sharing, and healing without noise.
                    </p>
                    <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem' }}>
                        <Link to="/signup" className="btn-durable">Enter the vault</Link>
                        <Link to="/login" className="btn-durable" style={{ background: 'transparent', color: 'var(--text-main)' }}>Login</Link>
                    </div>
                </div>
            </section>

            {/* EXHIBITS / FEATURES SECTION */}
            <section ref={exhibitRef} style={{ padding: '15vh 5vw', display: 'flex', flexDirection: 'column', gap: '10vh' }}>
                <div className="reveal-block" style={{ borderBottom: '1px solid var(--text-main)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                    <h2 className="heading-lg" style={{ color: 'var(--text-main)' }}>
                        What we do.
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {exhibits.map((exhibit, idx) => (
                        <div key={idx} className="reveal-block" style={{
                            background: exhibit.color,
                            color: exhibit.textColor,
                            padding: '4rem 3rem',
                            border: exhibit.border || 'none',
                            borderRadius: '8px', /* Sleek geometric */
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            aspectRatio: '1 / 1.1',
                            justifyContent: 'space-between'
                        }}>
                            <h3 style={{ fontSize: '3rem', fontFamily: 'var(--font-accent)', lineHeight: 1, whiteSpace: 'pre-line', fontWeight: 500 }}>{exhibit.title}</h3>
                            <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>{exhibit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SPECIALIZED CONCERNS SECTION */}
            <section ref={concernsRef} style={{ padding: '15vh 5vw', display: 'flex', flexDirection: 'column', gap: '5vh' }}>
                <div className="reveal-block" style={{ borderBottom: '1px solid var(--text-main)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                    <h2 className="heading-lg" style={{ color: 'var(--text-main)' }}>
                        Specialized Concerns.
                    </h2>
                    <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-body)', color: 'var(--text-main)', marginTop: '1rem', maxWidth: '800px' }}>
                        No matter what you're facing, you are completely safe here. Click to explore focused resources.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', backgroundColor: 'var(--text-main)', border: '1px solid var(--text-main)' }}>
                    {concerns.map((concern, idx) => (
                        <div key={idx} className="reveal-block" style={{
                            padding: '3rem 2rem',
                            background: 'var(--secondary-bg)',
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'background-color 0.3s, color 0.3s',
                            cursor: 'pointer'
                        }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--text-main)'; e.currentTarget.style.color = 'var(--secondary-bg)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary-bg)'; e.currentTarget.style.color = 'var(--text-main)'; }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 500, fontFamily: 'var(--font-accent)' }}>{concern}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* SPACER SECTION to ensure footer scroll trigger fires cleanly */}
            <section ref={footerRef} style={{ height: '30vh' }}></section>
        </div>
    );
};

export default Home;
