import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Particles = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const particleCount = 20;
        const shapes = ['+', 'x', 'o', '△', '□'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            // Randomly select shape
            particle.innerText = shapes[Math.floor(Math.random() * shapes.length)];

            // Random styling
            particle.style.position = 'absolute';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            particle.style.fontSize = `${Math.random() * 20 + 10}px`;
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            particle.style.color = Math.random() > 0.5 ? 'var(--text-main)' : 'var(--accent)';
            particle.style.pointerEvents = 'none';
            particle.style.transform = `rotate(${Math.random() * 360}deg)`;

            container.appendChild(particle);

            // Animate
            gsap.to(particle, {
                y: `-=${Math.random() * 200 + 100}vh`,
                x: `+=${Math.random() * 100 - 50}vw`,
                rotation: `+=${Math.random() * 360}`,
                duration: Math.random() * 20 + 20,
                repeat: -1,
                ease: "none"
            });
        }

        return () => {
            if (container) {
                container.innerHTML = ''; // Cleanup
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 10000, // Increased z-index
                overflow: 'hidden'
            }}
        />
    );
};

export default Particles;
