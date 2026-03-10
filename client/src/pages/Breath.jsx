import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Wind, Activity } from 'lucide-react';

const Breath = () => {
    const [instruction, setInstruction] = useState('INITIALIZING_PROTOCOL');
    const [phase, setPhase] = useState('READY'); // READY, IN, HOLD, OUT
    const coreRef = useRef(null);
    const ringRef = useRef(null);

    const startProtocol = () => {
        setPhase('IN');
        runBreathingCycle();
    };

    const runBreathingCycle = () => {
        const tl = gsap.timeline({
            repeat: -1,
            onStart: () => setPhase('IN')
        });

        // 4s In
        tl.to(coreRef.current, {
            scale: 2.5,
            duration: 4,
            ease: "sine.inOut",
            onStart: () => setInstruction('NEURAL_EXPANSION // INHALE')
        });
        tl.to(ringRef.current, {
            scale: 3,
            opacity: 0.5,
            duration: 4,
            ease: "sine.inOut"
        }, 0);

        // 7s Hold
        tl.to({}, {
            duration: 7,
            onStart: () => {
                setPhase('HOLD');
                setInstruction('STABILIZING_LEVELS // HOLD');
            }
        });

        // 8s Out
        tl.to(coreRef.current, {
            scale: 1,
            duration: 8,
            ease: "sine.inOut",
            onStart: () => {
                setPhase('OUT');
                setInstruction('NEURAL_RELEASE // EXHALE');
            }
        });
        tl.to(ringRef.current, {
            scale: 1,
            opacity: 0.1,
            duration: 8,
            ease: "sine.inOut"
        }, "-=8");
    };

    return (
        <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'hidden' }}>
            <div className="technical-frame" />

            <div style={{ position: 'absolute', top: '5rem', textAlign: 'center' }}>
                <p className="text-technical" style={{ marginBottom: '1rem' }}>PROTOCOL // BREATHE_01</p>
                <h1 style={{ fontSize: '2.5rem', letterSpacing: '0.2em' }}>NEURAL_CALIBRATION</h1>
            </div>

            <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Visualizer Rings */}
                <div ref={ringRef} style={{
                    position: 'absolute',
                    width: '100px',
                    height: '100px',
                    border: '1px solid var(--accent-teal)',
                    borderRadius: '50%',
                    opacity: 0.1
                }} />

                {/* The Core */}
                <div ref={coreRef} style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--accent-teal)',
                    borderRadius: '50%',
                    boxShadow: '0 0 50px var(--accent-teal)',
                    filter: 'blur(1px)',
                    zIndex: 2
                }} />

                {/* Technical Overlay */}
                <div style={{ position: 'absolute', bottom: '-8rem', textAlign: 'center', width: '200%' }}>
                    <p className="text-technical" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{instruction}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', opacity: 0.3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={12} />
                            <span className="text-technical" style={{ fontSize: '0.5rem' }}>HRV_SYNC: ACTIVE</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Wind size={12} />
                            <span className="text-technical" style={{ fontSize: '0.5rem' }}>FLOW_CTRL: NOMINAL</span>
                        </div>
                    </div>
                </div>
            </div>

            {phase === 'READY' && (
                <button
                    onClick={startProtocol}
                    className="btn-mindjoin"
                    style={{ position: 'absolute', bottom: '15%' }}
                >
                    [ INITIALIZE_SYNC ]
                </button>
            )}

            {/* Side Status Indicators */}
            <div style={{ position: 'fixed', right: '4rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.2 }}>
                {['INHALE', 'HOLD', 'EXHALE'].map((s) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
                        <span className="text-technical" style={{ fontSize: '0.6rem' }}>{s}</span>
                        <div style={{ width: '4px', height: '4px', background: 'var(--text-primary)', borderRadius: '50%' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Breath;
