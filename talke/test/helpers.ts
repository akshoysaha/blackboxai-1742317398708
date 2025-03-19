/// <reference types="vitest/globals" />

// Type for mocked fetch response
interface MockResponse {
  ok: boolean;
  json: () => Promise<any>;
  status?: number;
  headers?: Record<string, string>;
}

// Helper to create a mock fetch response
export function createMockResponse(data: any, options: Partial<MockResponse> = {}): MockResponse {
  return {
    ok: options.ok ?? true,
    status: options.status ?? (options.ok === false ? 400 : 200),
    headers: options.headers ?? {},
    json: () => Promise.resolve(data),
  };
}

// Mock window.matchMedia
export function mockMatchMedia(matches = false) {
  const matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMedia,
  });

  return matchMedia;
}

// Mock IntersectionObserver
export function mockIntersectionObserver() {
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  class MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      // Store callback if needed
      this.callback = callback;
    }

    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
    callback: IntersectionObserverCallback;
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });

  return { observe, unobserve, disconnect };
}

// Mock ResizeObserver
export function mockResizeObserver() {
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  class MockResizeObserver {
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  }

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
  });

  return { observe, unobserve, disconnect };
}

// Mock fetch
export function mockFetch(...responses: MockResponse[]) {
  let callCount = 0;
  
  const fetchMock = vi.fn().mockImplementation(() => {
    const response = responses[callCount];
    callCount += 1;
    return Promise.resolve(response);
  });

  global.fetch = fetchMock;

  return {
    fetch: fetchMock,
    getCallCount: () => callCount,
    reset: () => {
      callCount = 0;
      vi.resetAllMocks();
    },
  };
}