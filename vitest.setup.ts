import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';

import { server } from './src/shared/api/mocks/server';

const DEFAULT_RESPONSIVE_MEDIA_QUERIES = new Set([
  '(min-width: 48rem)',
  '(min-width: 64rem)',
  '(min-width: 80rem)',
]);

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

class IntersectionObserverStub {
  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(element: Element): void {
    this.callback(
      [
        {
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: element.getBoundingClientRect(),
          isIntersecting: true,
          rootBounds: null,
          target: element,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverStub,
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn<(query: string) => MediaQueryList>().mockImplementation((query) => ({
    matches:
      query.includes('prefers-reduced-motion') || DEFAULT_RESPONSIVE_MEDIA_QUERIES.has(query),
    media: query,
    onchange: null,
    addListener: vi.fn<() => void>(),
    removeListener: vi.fn<() => void>(),
    addEventListener: vi.fn<() => void>(),
    removeEventListener: vi.fn<() => void>(),
    dispatchEvent: vi.fn<() => boolean>(),
  })),
});

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'bypass',
  });
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  cleanup();
});

afterAll(() => {
  server.close();
  vi.resetAllMocks();
});
