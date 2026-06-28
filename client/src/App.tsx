import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import OkaySpaceHomeView from './views/OkaySpaceHomeView';
import EchoView from './views/EchoView';
import ResonanceView from './views/ResonanceView';
import PrismView from './views/PrismView';
import NexusView from './views/NexusView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import useStore from './store/useStore';

const VIEW_COMPONENTS = {
  'home': OkaySpaceHomeView,
  'echo': EchoView,
  'resonance': ResonanceView,
  'prism': PrismView,
  'nexus': NexusView,
  'cortex': AnalyticsView,
  'settings': SettingsView,
};

function App() {
  const activeView = useStore((s) => s.activeView || 'home');
  const ActiveComponent = VIEW_COMPONENTS[activeView] || OkaySpaceHomeView;

  return (
    <div className="app-layout" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <main style={{ flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <ActiveComponent key={activeView} />
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
