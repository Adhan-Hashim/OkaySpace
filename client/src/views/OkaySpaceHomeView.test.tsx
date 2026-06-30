import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OkaySpaceHomeView from './OkaySpaceHomeView';
import { expect, test, vi } from 'vitest';

// Mock Zustand store
vi.mock('../store/useStore', () => {
  return {
    default: vi.fn((selector) => {
      const state = {
        setActiveView: vi.fn(),
        setPrismThought: vi.fn(),
      };
      return selector(state);
    }),
  };
});

// Mock Framer Motion to bypass animation issues in jsdom
vi.mock('framer-motion', () => {
  return {
    motion: {
      div: ({ children, className, 'data-testid': testId }) => <div className={className} data-testid={testId}>{children}</div>,
      h1: ({ children, className }) => <h1 className={className}>{children}</h1>,
      p: ({ children, className }) => <p className={className}>{children}</p>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

describe('OkaySpaceHomeView', () => {
  test('renders the main heading and quote', () => {
    render(<OkaySpaceHomeView />);
    
    expect(screen.getByText('A safe space for you')).toBeDefined();
    expect(screen.getByText(/You don't have to be okay to come here/i)).toBeDefined();
  });

  test('renders the feature cards', () => {
    render(<OkaySpaceHomeView />);
    
    expect(screen.getByText('Echo')).toBeDefined();
    expect(screen.getByText('Prism')).toBeDefined();
    expect(screen.getByText('Meditations')).toBeDefined();
    expect(screen.getByText('Nexus')).toBeDefined();
  });
});
