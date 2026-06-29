import React, { useState, useRef, useCallback } from 'react';
import PrismScene from '../components/PrismScene';
import ThoughtInput from '../components/ThoughtInput';
import PerspectivePanel from '../components/PerspectivePanel';
import api from '../api';

const PERSPECTIVE_NAMES = [
  'Your Future Self',
  'Your Best Friend',
  'The Stoic',
  'The Scientist',
  'Your Inner Child',
];

const COLOR_MAP = {
  'Your Future Self': '#a855f7',
  'Your Best Friend': '#3b82f6',
  'The Stoic': '#f59e0b',
  'The Scientist': '#06b6d4',
  'Your Inner Child': '#ec4899',
};

export default function PrismModule({ onBack }) {
  const [phase, setPhase] = useState('input'); // 'input' | 'loading' | 'shattered' | 'focused'
  const [perspectives, setPerspectives] = useState(null);
  const [originalThought, setOriginalThought] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [hoverInfo, setHoverInfo] = useState({ index: -1, x: 0, y: 0 });
  const sceneRef = useRef({});

  const handleSubmit = async (thought) => {
    setOriginalThought(thought);
    setPhase('loading');

    try {
      const res = await api.post('/ai/refract', { thought });
      const data = res.data;

      const mapped = PERSPECTIVE_NAMES.map((name, i) => ({
        name,
        text: data.perspectives?.[i]?.text || data.perspectives?.[i] || `Take a moment to consider this from a different angle. Your thought "${thought}" may not be the complete picture.`,
      }));

      setPerspectives(mapped);
      setPhase('shattered');

      const entry = {
        id: Date.now(),
        thought,
        perspectives: mapped,
        date: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('prism_entries') || '[]');
      localStorage.setItem('prism_entries', JSON.stringify([entry, ...existing].slice(0, 50)));

    } catch (err) {
      console.error(err);
      const mapped = PERSPECTIVE_NAMES.map((name) => ({
        name,
        text: getMockPerspective(name, thought),
      }));
      setPerspectives(mapped);
      setPhase('shattered');
    }
  };

  const handleFragmentClick = useCallback((index) => {
    setFocusedIndex(index);
    setPhase('focused');
    if (sceneRef.current) sceneRef.current.focusedIndex = index;
  }, []);

  const handleBackFromPerspective = () => {
    setFocusedIndex(null);
    setPhase('shattered');
    if (sceneRef.current) sceneRef.current.focusedIndex = null;
  };

  const handleReset = () => {
    setPhase('input');
    setPerspectives(null);
    setFocusedIndex(null);
    setOriginalThought('');
    if (sceneRef.current) {
      sceneRef.current.focusedIndex = null;
      sceneRef.current.shatterProgress = 0;
    }
  };

  const handleHoverFragment = useCallback((index, x, y) => {
    setHoverInfo({ index, x, y });
  }, []);

  return (
    <div className="module-wrap">
      <PrismScene
        phase={phase}
        onFragmentClick={handleFragmentClick}
        onHoverFragment={handleHoverFragment}
        ref={sceneRef}
      />
      
      <button className="back-btn" onClick={onBack}>← Hub</button>

      <div className="prism-title">Prism</div>

      <ThoughtInput
        visible={phase === 'input'}
        loading={phase === 'loading'}
        onSubmit={handleSubmit}
      />

      {hoverInfo.index >= 0 && phase === 'shattered' && (
        <div
          className="fragment-label visible glass"
          style={{
            left: hoverInfo.x + 15,
            top: hoverInfo.y - 15,
            color: COLOR_MAP[PERSPECTIVE_NAMES[hoverInfo.index]],
          }}
        >
          {PERSPECTIVE_NAMES[hoverInfo.index]}
        </div>
      )}

      <PerspectivePanel
        perspective={focusedIndex !== null && perspectives ? perspectives[focusedIndex] : null}
        originalThought={originalThought}
        onClose={handleBackFromPerspective}
      />

      {(phase === 'shattered' || phase === 'focused') && (
        <button className="history-btn" onClick={handleReset}>
          New Thought
        </button>
      )}

      {phase === 'shattered' && (
        <div className="instruction-hint">Click a fragment to explore that perspective</div>
      )}
    </div>
  );
}

function getMockPerspective(name, thought) {
  const perspectives = {
    'Your Future Self': `Five years from now, you'll look back at this moment and realize it was just a small chapter in a much larger story. The thought "${thought}" feels overwhelming right now, but it won't define your future. You've already survived every difficult moment that came before this one. Trust the version of yourself who has already made it through.`,
    'Your Best Friend': `If you came to me and said "${thought}", I would remind you that you're being way harder on yourself than you deserve. I've seen you overcome things you never thought possible. One setback doesn't erase everything you've built. I believe in you, even when you don't believe in yourself.`,
    'The Stoic': `Marcus Aurelius wrote: "You have power over your mind — not outside events. Realize this, and you will find strength." The situation you're describing is an external event. Your interpretation — "${thought}" — is within your control. Separate what happened from the story you're telling yourself about what happened.`,
    'The Scientist': `Let's examine the evidence objectively. The thought "${thought}" contains absolute language that rarely holds up under scrutiny. In reality, single events are poor predictors of long-term outcomes. Research in cognitive psychology shows that our minds catastrophize under stress — this is a known cognitive bias, not a reflection of reality.`,
    'Your Inner Child': `Hey. It's okay to feel scared or sad right now. You don't have to have everything figured out. Remember when you were little and something felt like the end of the world, but then it wasn't? You're still that same brave person who gets back up. It's okay to not be okay for a little while.`,
  };
  return perspectives[name] || `Consider this thought from a new angle. "${thought}" may not be the whole truth.`;
}
