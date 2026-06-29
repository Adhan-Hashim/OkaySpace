import React from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navigation from './components/Navigation';
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
  'home': OkaySpaceHomeView,
  'echo': EchoView,
  'meditations': MeditationsView,
  'prism': PrismView,
  'nexus': NexusView,
  'cortex': AnalyticsView,
  'settings': SettingsView,
};

function App() {
  const activeView = useStore((s) => s.activeView || 'home');
  const ActiveComponent = VIEW_COMPONENTS[activeView] || OkaySpaceHomeView;

  return (
    <AuthProvider>
      <div className="app-layout">
        <Navigation />
        <main className="main-content">
          <MotionConfig reducedMotion="user">
            <AnimatePresence mode="wait">
              <ActiveComponent key={activeView} />
            </AnimatePresence>
          </MotionConfig>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
