/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { mockMatchMedia, mockIntersectionObserver, mockResizeObserver } from './helpers';

// Run cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Set up global mocks before all tests
beforeAll(() => {
  // Mock browser APIs
  mockMatchMedia();
  mockIntersectionObserver();
  mockResizeObserver();

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

// Extend matchers
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toHaveBeenCalledOnce(): T;
    }
  }
}

// Add custom matchers
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000,
  teardownTimeout: 1000,
});

// Add custom matchers
expect.extend({
  toHaveBeenCalledOnce(received: any) {
    if (!received || typeof received !== 'object' || !('mock' in received)) {
      return {
        pass: false,
        message: () => `expected ${received} to be a mock function`,
      };
    }

    const mockFn = received as { mock: { calls: unknown[] } };
    const pass = mockFn.mock.calls.length === 1;

    return {
      pass,
      message: () =>
        pass
          ? () => `expected mock function not to have been called once`
          : () => `expected mock function to have been called once but it was called ${mockFn.mock.calls.length} times`,
    };
  },
});