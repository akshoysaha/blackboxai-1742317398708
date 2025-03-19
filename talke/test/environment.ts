/// <reference types="./types/test.d.ts" />

import '@testing-library/jest-dom';

// Run cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Mock window methods which are not implemented in JSDOM
beforeAll(() => {
  // Mock matchMedia
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // Mock IntersectionObserver
  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }));

  // Mock ResizeObserver
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock console.error to fail tests on React errors
  const originalError = console.error;
  console.error = vi.fn((...args: any[]) => {
    originalError(...args);
    throw new Error('Console error was called. Check the console output above.');
  });
});

// Clean up after all tests
afterAll(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});