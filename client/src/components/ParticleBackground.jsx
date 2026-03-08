import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground = ({ gender = 'default' }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        try {
            // Scene setup
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xfafafa);
            sceneRef.current = scene;

            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 100;
            cameraRef.current = camera;

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
            container.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Particle configuration based on gender
            const getParticleConfig = () => {
                switch (gender) {
                    case 'male':
                        return {
                            count: 100,
                            colors: [0x4a90e2, 0x2e5cb8, 0x6ba3f5],
                            shape: 'cube',
                            speed: 0.3,
                            spread: 150
                        };
                    case 'female':
                        return {
                            count: 120,
                            colors: [0xe74c8e, 0xff69b4, 0xff1493],
                            shape: 'sphere',
                            speed: 0.25,
                            spread: 180
                        };
                    default:
                        return {
                            count: 90,
                            colors: [0xf48b47, 0xff9d5c, 0xff6b35],
                            shape: 'tetrahedron',
                            speed: 0.28,
                            spread: 140
                        };
                }
            };

            const config = getParticleConfig();
            const particles = [];

            // Create particles
            for (let i = 0; i < config.count; i++) {
                let geometry;
                if (config.shape === 'cube') {
                    geometry = new THREE.BoxGeometry(2, 2, 2);
                } else if (config.shape === 'sphere') {
                    geometry = new THREE.IcosahedronGeometry(1.2, 3);
                } else {
                    geometry = new THREE.TetrahedronGeometry(1.5);
                }

                const colorIndex = Math.floor(Math.random() * config.colors.length);
                const material = new THREE.MeshPhongMaterial({
                    color: config.colors[colorIndex],
                    emissive: config.colors[colorIndex],
                    emissiveIntensity: 0.4,
                    shininess: 100,
                    wireframe: Math.random() > 0.7
                });

                const mesh = new THREE.Mesh(geometry, material);

                // Random position in spread area
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * config.spread;
                mesh.position.x = Math.cos(angle) * radius;
                mesh.position.y = Math.sin(angle) * radius;
                mesh.position.z = (Math.random() - 0.5) * 50;

                mesh.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );

                mesh.castShadow = true;
                mesh.receiveShadow = true;

                const particle = {
                    mesh,
                    vx: (Math.random() - 0.5) * config.speed,
                    vy: (Math.random() - 0.5) * config.speed,
                    vz: (Math.random() - 0.5) * config.speed,
                    rotVx: (Math.random() - 0.5) * 0.03,
                    rotVy: (Math.random() - 0.5) * 0.03,
                    rotVz: (Math.random() - 0.5) * 0.03,
                    life: 1
                };

                scene.add(mesh);
                particles.push(particle);
            }

            // Lighting setup
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 500);
            pointLight1.position.set(200, 200, 200);
            pointLight1.castShadow = true;
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0xffffff, 0.4, 300);
            pointLight2.position.set(-200, -200, 100);
            scene.add(pointLight2);

            let animationId;

            const animate = () => {
                animationId = requestAnimationFrame(animate);

                particles.forEach((particle) => {
                    // Update position
                    particle.mesh.position.x += particle.vx;
                    particle.mesh.position.y += particle.vy;
                    particle.mesh.position.z += particle.vz;

                    // Update rotation
                    particle.mesh.rotation.x += particle.rotVx;
                    particle.mesh.rotation.y += particle.rotVy;
                    particle.mesh.rotation.z += particle.rotVz;

                    // Floating effect
                    const time = Date.now() * 0.001;
                    particle.mesh.position.y += Math.sin(time + particle.mesh.uuid) * 0.01;

                    // Boundary wrapping
                    if (Math.abs(particle.mesh.position.x) > 300) particle.vx *= -1;
                    if (Math.abs(particle.mesh.position.y) > 300) particle.vy *= -1;
                    if (Math.abs(particle.mesh.position.z) > 250) particle.vz *= -1;
                });

                renderer.render(scene, camera);
            };

            animate();

            // Handle window resize
            const handleResize = () => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            };

            window.addEventListener('resize', handleResize);

            // Cleanup
            return () => {
                window.removeEventListener('resize', handleResize);
                cancelAnimationFrame(animationId);
                renderer.dispose();
                container.removeChild(renderer.domElement);
            };
        } catch (error) {
            console.error('Particle background error:', error);
        }
    }, [gender]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default ParticleBackground;
