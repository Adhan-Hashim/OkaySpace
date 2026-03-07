import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
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
import CustomCursor from './components/CustomCursor';
import Particles from './components/Particles';
import Footer from './components/Footer';
import QuickExit from './components/QuickExit';
import BackgroundMusic from './components/BackgroundMusic';
import { SafeModeProvider } from './context/SafeModeContext';

gsap.registerPlugin(ScrollTrigger);

// component to handle Lenis scroll mechanics
const LayoutManager = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Scroll to top on route change
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [location.pathname]);

  return <div className="foreground-content">{children}</div>;
};

function App() {
  return (
    <SafeModeProvider>
      <Router>
        <BackgroundMusic />
        <QuickExit />
        <CustomCursor />
        <Particles />
        <Navbar />
        <LayoutManager>
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
          </Routes>
          <Footer />
        </LayoutManager>
      </Router>
    </SafeModeProvider>
  );
}

export default App;
