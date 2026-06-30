import React from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import OkaySpaceHomeView from './views/OkaySpaceHomeView';
import EchoView from './views/EchoView';
import MeditationsView from './views/MeditationsView';
import PrismView from './views/PrismView';
import NexusView from './views/NexusView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import useStore from './store/useStore';
import { AuthProvider } from './context/AuthContext';

const VIEW_COMPONENTS = {
  'home':        OkaySpaceHomeView,
  'echo':        EchoView,
  'meditations': MeditationsView,
  'prism':       PrismView,
  'nexus':       NexusView,
  'cortex':      AnalyticsView,
  'settings':    SettingsView,
};

// Views that should not show the footer (immersive full-screen experiences)
const NO_FOOTER_VIEWS = ['echo', 'nexus'];

function App() {
  const activeView = useStore((s) => s.activeView || 'home');
  const ActiveComponent = VIEW_COMPONENTS[activeView] || OkaySpaceHomeView;
  const showFooter = !NO_FOOTER_VIEWS.includes(activeView);

  return (
    <AuthProvider>
      <div className="app-layout">
        <Navigation />
        <main className="main-content" style={{ marginBottom: showFooter ? '80vh' : 0, borderRadius: showFooter ? '0 0 50px 50px' : 0, boxShadow: showFooter ? '0px 20px 50px rgba(0,0,0,0.2)' : 'none' }}>
          <MotionConfig reducedMotion="user">
            <AnimatePresence mode="wait">
              <ActiveComponent key={activeView} />
            </AnimatePresence>
          </MotionConfig>
        </main>
        {showFooter && (
          <div className="footer-fixed-container">
            <Footer />
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
