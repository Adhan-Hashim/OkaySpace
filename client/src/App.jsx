import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickExit from './components/QuickExit';
import BackgroundMusic from './components/BackgroundMusic';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import MoodTracker from './pages/MoodTracker';
import AIChat from './pages/AIChat';
import Resources from './pages/Resources';
import Emergency from './pages/Emergency';
import Letters from './pages/Letters';
import Therapists from './pages/Therapists';
import Breath from './pages/Breath';
import ZenGarden from './pages/ZenGarden';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router basename="/OkaySpace">
      <div className="grain-overlay" />
      <div className="technical-frame" />
      <div className="frame-line line-v-left" />
      <div className="frame-line line-v-right" />
      <div className="frame-line line-h-top" />

      <QuickExit />
      <BackgroundMusic />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/mood" element={<MoodTracker />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/letters" element={<Letters />} />
        <Route path="/therapists" element={<Therapists />} />
        <Route path="/breath" element={<Breath />} />
        <Route path="/zen" element={<ZenGarden />} />
      </Routes>
      <Footer id="main-footer" />
    </Router>
  );
}

export default App;
