import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {
  return (
    <Router basename="/OkaySpace">
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
      </Routes>
      <Footer id="main-footer" />
    </Router>
  );
}

export default App;
