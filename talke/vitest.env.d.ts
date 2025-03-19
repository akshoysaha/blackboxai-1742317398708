/// <reference types="vite/client" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import type { SpyInstance, Mock } from 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
  interface AsymmetricMatchersContaining extends jest.AsymmetricMatchers {}
}

declare global {
  namespace Vi {
    interface Assertion<T = any> extends jest.Matchers<void, T> {}
    interface AsymmetricMatchersContaining extends jest.AsymmetricMatchers {}
  }

  interface Window {
    ResizeObserver: ResizeObserverConstructor;
    IntersectionObserver: IntersectionObserverConstructor;
  }

  interface Matchers<R = void, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
    toHaveBeenCalledOnce(): R;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      MATRIX_SERVER_URL?: string;
      SESSION_SECRET?: string;
    }
  }
}

declare module 'vite' {
  interface UserConfig {
    test?: {
      globals?: boolean;
      environment?: string;
      setupFiles?: string[];
      include?: string[];
      exclude?: string[];
      coverage?: {
        provider?: string;
        reporter?: string[];
        exclude?: string[];
      };
      reporters?: string[];
      watch?: boolean;
      deps?: {
        inline?: string[];
      };
    };
  }
}