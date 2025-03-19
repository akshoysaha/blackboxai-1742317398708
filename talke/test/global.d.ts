/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import type { SpyInstance, Mock } from 'vitest';

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T> {}
    interface AsymmetricMatchersContaining extends jest.AsymmetricMatchers {}
  }

  interface Window {
    ResizeObserver: ResizeObserverConstructor;
    IntersectionObserver: IntersectionObserverConstructor;
  }

  // Extend expect matchers
  interface Matchers<R = void, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
    toHaveBeenCalledOnce(): R;
  }

  // Extend vi with common types
  interface Vi {
    spyOn: typeof vi.spyOn;
    fn: typeof vi.fn;
    mock: typeof vi.mock;
  }

  // Add vi to global scope
  const vi: Vi;

  // Add testing functions to global scope
  function beforeAll(fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function test(name: string, fn: () => void): void;
  function expect<T = any>(actual: T): Matchers<void, T>;

  // Mock types
  type MockInstance<T extends (...args: any) => any> = Mock<Parameters<T>, ReturnType<T>>;
  type Spy<T extends (...args: any) => any> = SpyInstance<Parameters<T>, ReturnType<T>>;
}

// Extend NodeJS namespace
declare namespace NodeJS {
  interface Global {
    vi: typeof vi;
  }
}