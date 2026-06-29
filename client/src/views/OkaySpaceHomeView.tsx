import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import bgHome from '../assets/bg-home.png';
import logo from '../assets/logo.png';
import './OkaySpaceHomeView.css';

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

const FEATURES = [
  { id: 'echo', title: 'Echo', desc: 'AI Companion for listening and reframing.' },
  { id: 'prism', title: 'Prism', desc: 'Refract a difficult thought through six perspectives.' },
  { id: 'meditations', title: 'Meditations', desc: 'Science-backed breathing and guided audio.' },
  { id: 'nexus', title: 'Nexus', desc: 'Connect anonymously with another soul.' },
];

export default function OkaySpaceHomeView() {
  const setCurrentView = useStore((s) => s.setCurrentView);

  return (
    <motion.div className="home-page-nature" {...fade}>
      {/* Background Image Container */}
      <div className="home-bg" style={{ backgroundImage: `url(${bgHome})` }}>
        {/* Gradient Overlay for text readability */}
        <div className="home-overlay"></div>

        {/* Top Minimalist Nav / Eyebrow */}
        <div className="home-top-bar">
          <span>sanctuary</span>
          <span>mindfulness</span>
          <span>connection</span>
        </div>

        {/* Central Typography Section */}
        <div className="home-center-content">
          <div className="home-date-left t-organic">10</div>
          
          <div className="home-title-wrapper">
            <div className="home-location">A safe space for you</div>
            <img src={logo} alt="OkaySpace Logo" style={{ width: '100%', maxWidth: '300px', marginBottom: '1.5rem', mixBlendMode: 'multiply' }} />
            <p className="home-quote t-serif">
              You don't have to be okay to come here.<br/>
              You just have to be willing to try.
            </p>
          </div>

          <div className="home-date-right t-organic">06</div>
        </div>

        {/* Features Glass Panels at the bottom */}
        <div className="home-features-container">
           {FEATURES.map((f, i) => (
             <motion.div 
                key={f.id} 
                className="glass-panel home-feature-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1), duration: 0.6 }}
                onClick={() => setCurrentView(f.id)}
             >
                <h3 className="t-organic">{f.title}</h3>
                <p>{f.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}
