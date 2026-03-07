import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Create quickSetters for high performance GSAP mouse tracking
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });

        const moveCursor = (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        const handleMouseEnter = () => {
            gsap.to(cursor, { scale: 3, backgroundColor: 'var(--accent)', mixBlendMode: 'difference', opacity: 1, duration: 0.3 });
        };

        const handleMouseLeave = () => {
            gsap.to(cursor, { scale: 1, backgroundColor: 'var(--text-main)', mixBlendMode: 'normal', opacity: 1, duration: 0.3 });
        };

        window.addEventListener("mousemove", moveCursor);

        // Add hover effects to all links and buttons
        const interactables = document.querySelectorAll('a, button, input, [data-cursor="hover"]');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            interactables.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '15px',
                height: '15px',
                backgroundColor: 'var(--text-main)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translate(-50%, -50%)',
                mixBlendMode: 'difference'
            }}
        />
    );
};

export default CustomCursor;
