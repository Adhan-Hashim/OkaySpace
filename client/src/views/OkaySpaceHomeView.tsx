import React from 'react';
import { motion } from 'framer-motion';

export default function OkaySpaceHomeView() {
  return (
    <div className="view-container">
      <motion.div 
        className="home-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-text">
          <h1 className="hero-title">OKAYSPACE</h1>
          
          <div style={{ marginTop: '2rem' }}>
            <h2 className="heading-sm" style={{ marginBottom: '1rem', color: 'var(--accent)' }}>About Us</h2>
            <p className="text-body" style={{ fontSize: '1.25rem', maxWidth: '400px' }}>
              OkaySpace is a digital sanctuary that celebrates contemporary mindfulness and mental wellbeing across a wide range of interactive disciplines.
            </p>
          </div>
          
          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started</button>
            <button className="btn btn-ghost" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Learn More</button>
          </div>
        </div>

        <motion.div 
          className="hero-image-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src="/hero_editorial.png" alt="Editorial Abstract Illustration" />
        </motion.div>
      </motion.div>
    </div>
  );
}
