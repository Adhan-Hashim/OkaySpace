import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground = ({ gender = 'default' }) => {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const particlesRef = useRef([]);
    const animationIdRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        camera.position.z = 100;

        // Particle configuration based on gender
        const getParticleConfig = () => {
            switch (gender) {
                case 'male':
                    return {
                        count: 150,
                        color: 0x4a90e2,
                        shape: 'cube',
                        speed: 0.5,
                        spread: 200,
                        gravity: 0.1,
                        attraction: 0.02
                    };
                case 'female':
                    return {
                        count: 200,
                        color: 0xe74c8e,
                        shape: 'sphere',
                        speed: 0.3,
                        spread: 250,
                        gravity: 0.05,
                        attraction: 0.01
                    };
                default:
                    return {
                        count: 120,
                        color: 0xf48b47,
                        shape: 'tetrahedron',
                        speed: 0.4,
                        spread: 180,
                        gravity: 0.08,
                        attraction: 0.015
                    };
            }
        };

        const config = getParticleConfig();
        const centerX = 0, centerY = 0;

        // Create particles
        const particles = [];
        for (let i = 0; i < config.count; i++) {
            const geometry = config.shape === 'cube' 
                ? new THREE.BoxGeometry(1, 1, 1)
                : config.shape === 'sphere'
                ? new THREE.IcosahedronGeometry(0.5, 4)
                : new THREE.TetrahedronGeometry(0.5);

            const material = new THREE.MeshPhongMaterial({
                color: config.color,
                emissive: config.color,
                emissiveIntensity: 0.3,
                wireframe: Math.random() > 0.7
            });
            const mesh = new THREE.Mesh(geometry, material);

            const angle = (Math.random() * Math.PI * 2);
            const radius = Math.random() * config.spread;
            mesh.position.x = centerX + Math.cos(angle) * radius;
            mesh.position.y = centerY + Math.sin(angle) * radius;
            mesh.position.z = (Math.random() - 0.5) * 100;

            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

            const particle = {
                mesh,
                vx: (Math.random() - 0.5) * config.speed,
                vy: (Math.random() - 0.5) * config.speed,
                vz: (Math.random() - 0.5) * config.speed,
                rotVx: (Math.random() - 0.5) * 0.02,
                rotVy: (Math.random() - 0.5) * 0.02,
                rotVz: (Math.random() - 0.5) * 0.02,
                angle: angle,
                radius: radius,
                life: 1,
                maxLife: 1,
                originalY: mesh.position.y
            };

            scene.add(mesh);
            particles.push(particle);
        }

        particlesRef.current = particles;

        // Lighting
        const light1 = new THREE.PointLight(config.color, 1, 500);
        light1.position.set(100, 100, 100);
        scene.add(light1);

        const light2 = new THREE.PointLight(0xffffff, 0.3, 800);
        light2.position.set(-100, -100, 100);
        scene.add(light2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            particles.forEach((p) => {
                // Gravity
                p.vy -= config.gravity * 0.01;

                // Attraction to center
                const dx = centerX - p.mesh.position.x;
                const dy = centerY - p.mesh.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                    p.vx += (dx / distance) * config.attraction;
                    p.vy += (dy / distance) * config.attraction * 0.5;
                }

                // Update position
                p.mesh.position.x += p.vx;
                p.mesh.position.y += p.vy;
                p.mesh.position.z += p.vz;

                // Rotation
                p.mesh.rotation.x += p.rotVx;
                p.mesh.rotation.y += p.rotVy;
                p.mesh.rotation.z += p.rotVz;

                // Oscillation
                const time = Date.now() * 0.001;
                p.mesh.position.z += Math.sin(time + p.angle) * 0.2;

                // Boundary wrapping
                if (Math.abs(p.mesh.position.x) > 300) p.vx *= -1;
                if (Math.abs(p.mesh.position.y) > 300) p.vy *= -1;
            });

            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationIdRef.current);
            renderer.dispose();
            particles.forEach(p => scene.remove(p.mesh));
        };
    }, [gender]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0
            }}
        />
    );
};

export default ParticleBackground;
