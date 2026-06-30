import { create } from 'zustand';

// Emotion color mapping
export const EMOTION_COLORS = {
  calm: '#a3c9e2',
  joy: '#fbc4ab',
  sadness: '#ced4da',
  anxiety: '#ffb5a7',
  anger: '#e5989b',
  hope: '#fdf0d5',
  neutral: '#e9ecef',
  gratitude: '#f8edeb',
  confusion: '#d8e2dc',
  peace: '#b2f7ef',
};

export const EMOTION_LABELS = {
  calm: 'Calm',
  joy: 'Joy',
  sadness: 'Sadness',
  anxiety: 'Anxiety',
  anger: 'Anger',
  hope: 'Hope',
  neutral: 'Neutral',
  gratitude: 'Gratitude',
  confusion: 'Confusion',
  peace: 'Peace',
};

const useStore = create((set) => ({
  // ---- Navigation ----
  activeView: 'home',
  currentView: 'home',
  setActiveView: (view) => set({ activeView: view, currentView: view }),
  setCurrentView: (view) => set({ activeView: view, currentView: view }),

  // ---- Emotional State ----
  currentEmotion: 'neutral',
  emotionIntensity: 0.5,
  setEmotion: (emotion, intensity = 0.5) => set({ currentEmotion: emotion, emotionIntensity: intensity }),

  // ---- Neural Nodes (Emotion History) ----
  neuralNodes: [],
  addNeuralNode: (node) => set((state) => ({
    neuralNodes: [...state.neuralNodes, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...node,
    }],
  })),

  // ---- Echo (AI Companion) ----
  echoMessages: [],
  echoMode: 'companion', // companion | reframe
  echoIsTyping: false,
  echoMemories: (() => {
    try {
      const saved = localStorage.getItem('okayspace_echo_memories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })(),
  addEchoMessage: (message) => set((state) => ({
    echoMessages: [...state.echoMessages, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...message,
    }],
  })),
  addEchoMemory: (memory) => set((state) => {
    const newMem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...memory,
    };
    const updated = [...state.echoMemories, newMem].slice(-100);
    try {
      localStorage.setItem('okayspace_echo_memories', JSON.stringify(updated));
    } catch (e) {
      console.warn("localStorage persistence failed:", e);
    }
    return { echoMemories: updated };
  }),
  setEchoMode: (mode) => set({ echoMode: mode }),
  setEchoTyping: (typing) => set({ echoIsTyping: typing }),

  // ---- Prism (Thought Reframing) ----
  prismThought: null,
  prismFacets: [],
  prismLoading: false,
  setPrismThought: (thought) => set({ prismThought: thought }),
  setPrismFacets: (facets) => set({ prismFacets: facets }),
  setPrismLoading: (loading) => set({ prismLoading: loading }),
  clearPrism: () => set({ prismThought: null, prismFacets: [], prismLoading: false }),

  // ---- Resonance (Breathing) ----
  breathingPattern: 'box',
  breathingActive: false,
  setBreathingPattern: (pattern) => set({ breathingPattern: pattern }),
  setBreathingActive: (isActive) => set({ breathingActive: isActive }),

  // ---- Session Stats ----
  sessionStart: new Date().toISOString(),
  interactionCount: 0,
  incrementInteraction: () => set((state) => ({ interactionCount: state.interactionCount + 1 })),
}));

export default useStore;
