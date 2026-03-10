import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Trash2, ShieldAlert } from 'lucide-react';

const ZenGarden = () => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const [worry, setWorry] = useState('');

    useEffect(() => {
        // Setup Matter.js
        const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Composite } = Matter;

        const engine = Engine.create();
        engineRef.current = engine;
        const world = engine.world;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent',
            }
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Walls
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });

        World.add(world, [ground, leftWall, rightWall]);

        // Mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        World.add(world, mouseConstraint);

        // Resize handler
        const handleResize = () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
            Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
            Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            Render.stop(render);
            Runner.stop(runner);
            Engine.clear(engine);
            render.canvas.remove();
        };
    }, []);

    const addWorry = (e) => {
        e.preventDefault();
        if (!worry.trim()) return;

        const { Bodies, World } = Matter;
        const x = Math.random() * (window.innerWidth - 200) + 100;

        // Calculate dimensions based on text length
        const width = Math.max(100, worry.length * 10);
        const height = 40;

        const box = Bodies.rectangle(x, -50, width, height, {
            restitution: 0.5,
            render: {
                fillStyle: 'transparent',
                strokeStyle: 'var(--accent-magenta)',
                lineWidth: 1,
                text: {
                    content: worry,
                    color: 'var(--text-primary)',
                    size: 12,
                    family: 'var(--font-mono)'
                }
            }
        });

        // Add custom text rendering to Matter.js
        box.label = worry;

        World.add(engineRef.current.world, box);
        setWorry('');

        // Recycle after 20 seconds
        setTimeout(() => {
            Matter.Composite.remove(engineRef.current.world, box);
        }, 20000);
    };

    return (
        <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            <div className="technical-frame" />

            <div ref={sceneRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

            <div style={{ position: 'relative', zIndex: 10, padding: '10rem 10% 4rem', pointerEvents: 'none' }}>
                <div style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-line)' }}>
                    <p className="text-technical" style={{ marginBottom: '1rem' }}>VOID_DISCHARGE // GRAVITY_RECON</p>
                    <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>GRAVITY_VOID</h1>
                </div>

                <div style={{ maxWidth: '600px', pointerEvents: 'all' }}>
                    <p className="text-technical" style={{ fontSize: '0.7rem', marginBottom: '2rem', opacity: 0.5 }}>
                        Materialize your psychological debris and witness the redistribution of entropy.
                    </p>

                    <form onSubmit={addWorry} style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={worry}
                            onChange={(e) => setWorry(e.target.value)}
                            placeholder="INPUT_ENTITY_FRICTION..."
                            style={{
                                flex: 1,
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid var(--border-line)',
                                padding: '1rem 1.5rem',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-mono)',
                                outline: 'none'
                            }}
                        />
                        <button type="submit" className="btn-mindjoin" style={{ padding: '1rem 2rem' }}>
                            [ MATERIALIZE ]
                        </button>
                    </form>
                </div>
            </div>

            {/* Background Symbols */}
            <div style={{ position: 'fixed', left: '4rem', bottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.2, pointerEvents: 'none' }}>
                <Trash2 size={16} />
                <span className="text-technical" style={{ fontSize: '0.5rem' }}>GRAVITY_WELL: NOMINAL</span>
                <ShieldAlert size={16} style={{ marginLeft: '1rem' }} />
                <span className="text-technical" style={{ fontSize: '0.5rem' }}>ENTROPY_GUARD: ACTIVE</span>
            </div>

            <style>{`
                canvas {
                    display: block;
                }
            `}</style>
        </div>
    );
};

export default ZenGarden;
