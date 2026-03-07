import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Magnetic = ({ children }) => {
    const magneticRef = useRef(null);

    useEffect(() => {
        const xTo = gsap.quickTo(magneticRef.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(magneticRef.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const mouseMove = (e) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = magneticRef.current.getBoundingClientRect();

            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xTo(x * 0.35); // 0.35 is the strength of the magnetic pull
            yTo(y * 0.35);
        };

        const mouseLeave = () => {
            gsap.to(magneticRef.current, { x: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
            gsap.to(magneticRef.current, { y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        };

        const el = magneticRef.current;
        if (el) {
            el.addEventListener("mousemove", mouseMove);
            el.addEventListener("mouseleave", mouseLeave);
        }

        return () => {
            if (el) {
                el.removeEventListener("mousemove", mouseMove);
                el.removeEventListener("mouseleave", mouseLeave);
            }
        };
    }, []);

    // Clone the child element and attach the ref so we can animate it
    return React.cloneElement(children, { ref: magneticRef });
};

export default Magnetic;
