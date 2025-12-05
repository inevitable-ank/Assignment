import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  // Clear localStorage
  localStorage.clear();
  // Clear all mocks
  vi.clearAllMocks();
});

// Mock window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    href: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
});

// Mock fetch globally
global.fetch = vi.fn();


