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
  test('renders the main heading and subtitle', () => {
    render(<OkaySpaceHomeView />);
    
    expect(screen.getByText('A Safe Space for Your Mind')).toBeDefined();
    expect(screen.getByText(/Tools for emotional clarity/i)).toBeDefined();
  });

  test('can type in the input and trigger a reframing', () => {
    render(<OkaySpaceHomeView />);
    
    const input = screen.getByPlaceholderText(/What's on your mind?/i);
    expect(input).toBeDefined();

    fireEvent.change(input, { target: { value: 'I feel stressed' } });
    expect(input.value).toBe('I feel stressed');

    const button = screen.getByText('Refract Thought');
    fireEvent.click(button);
    // Since useStore is mocked, we just verify the component doesn't crash on interaction
  });
});
