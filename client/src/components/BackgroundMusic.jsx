import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isOverFooter, setIsOverFooter] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Set volume to a reasonable background level
        audio.volume = 0.3;

        // Attempt to autoplay
        const playAudio = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (err) {
                // Autoplay was prevented by the browser. 
                // We must wait for the user to interact with the document first.
                console.log("Autoplay blocked. Waiting for user interaction...");
                const handleInteraction = async () => {
                    try {
                        await audio.play();
                        setIsPlaying(true);
                        // Clean up listeners once playing
                        document.removeEventListener('click', handleInteraction);
                        document.removeEventListener('keydown', handleInteraction);
                        document.removeEventListener('touchstart', handleInteraction);
                    } catch (e) {
                        console.error("Playback failed after interaction", e);
                    }
                };

                document.addEventListener('click', handleInteraction);
                document.addEventListener('keydown', handleInteraction);
                document.addEventListener('touchstart', handleInteraction);
            }
        };

        playAudio();

        // Observer for footer overlap
        const footer = document.getElementById('main-footer');
        let observer;
        if (footer) {
            observer = new IntersectionObserver(
                ([entry]) => {
                    setIsOverFooter(entry.isIntersecting);
                },
                { threshold: 0.1 }
            );
            observer.observe(footer);
        }

        return () => {
            audio.pause();
            if (observer && footer) observer.unobserve(footer);
        };
    }, []);

    const buttonColor = isOverFooter ? 'var(--bg-deep)' : '#ffffff';
    const inverseColor = isOverFooter ? '#ffffff' : 'var(--bg-deep)';

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={`${import.meta.env.BASE_URL}assets/bg-music.mp3`.replace(/\/+/g, '/')}
                loop
                preload="auto"
            />

            <div
                onClick={togglePlay}
                style={{
                    position: 'fixed',
                    bottom: '40px',
                    left: '40px',
                    zIndex: 999998,
                    width: '120px',
                    height: '120px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                title={isPlaying ? "Pause Music" : "Play Music"}
            >
                {/* Sleek Rotating SVG Text Ring */}
                <svg
                    viewBox="0 0 100 100"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        animation: isPlaying ? 'rotateText 10s linear infinite' : 'rotateText 20s linear infinite',
                        transformOrigin: 'center center'
                    }}
                >
                    <path
                        id="textPath"
                        d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                        fill="none"
                    />
                    <text
                        fill={buttonColor}
                        fontFamily="var(--font-accent)"
                        fontSize="10"
                        fontWeight="500"
                        letterSpacing="1px"
                    >
                        <textPath href="#textPath" startOffset="0%">
                            BACKGROUND AUDIO • BACKGROUND AUDIO •
                        </textPath>
                    </text>
                </svg>

                {/* Minimalist Inner Play Circle */}
                <div style={{
                    position: 'absolute',
                    width: '60px',
                    height: '60px',
                    background: 'transparent',
                    border: `1px solid ${buttonColor}`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    transition: 'background-color 0.3s, border-color 0.3s'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = buttonColor;
                        e.currentTarget.querySelector('svg, div').style.stroke = inverseColor;
                        if (e.currentTarget.querySelector('div')) {
                            Array.from(e.currentTarget.querySelectorAll('div > div')).forEach(d => d.style.background = inverseColor);
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.querySelector('svg, div').style.stroke = buttonColor;
                        if (e.currentTarget.querySelector('div')) {
                            Array.from(e.currentTarget.querySelectorAll('div > div')).forEach(d => d.style.background = buttonColor);
                        }
                    }}
                >
                    {isPlaying ? (
                        // Minimal Pause Icon
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ width: '2px', height: '16px', background: buttonColor, transition: 'background-color 0.3s' }}></div>
                            <div style={{ width: '2px', height: '16px', background: buttonColor, transition: 'background-color 0.3s' }}></div>
                        </div>
                    ) : (
                        // Minimal Play Icon
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={buttonColor} strokeWidth="1.5" strokeLinejoin="round" style={{ transition: 'stroke 0.3s', marginLeft: '2px' }}>
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes rotateText {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};

export default BackgroundMusic;
