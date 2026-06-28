import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import './OkaySpaceHomeView.css';

const OkaySpaceHomeView: React.FC = () => {
  const [thought, setThought] = useState('');
  const setActiveView = useStore((s) => s.setActiveView);
  const setPrismThought = useStore((s) => s.setPrismThought);

  const handleRefract = () => {
    if (thought.trim()) {
      setPrismThought(thought.trim());
      setActiveView('prism');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="home-container">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="home-content"
      >
        {/* Subtle top text / social proof style */}
        <motion.div variants={itemVariants} className="social-proof-container">
          <div className="social-proof-avatars">
            <div className="avatar-1" />
            <div className="avatar-2" />
            <div className="avatar-3" />
          </div>
          <span className="text-caption social-proof-text">
            Join a mindful community
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 variants={itemVariants} className="heading-xl hero-title">
          A Safe Space for Your Mind
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-body hero-subtitle">
          Tools for emotional clarity — say goodbye to overwhelming anxiety and endless rumination. 
          Say hello to intentional living.
        </motion.p>

        {/* Action Glass Pill */}
        <motion.div variants={itemVariants} className="action-container">
          <div className="glass action-glass">
            <input 
              type="text" 
              placeholder="What's on your mind?..." 
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRefract()}
              className="action-input"
            />
            <button 
              onClick={handleRefract}
              className="action-button"
            >
              Refract Thought
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OkaySpaceHomeView;
