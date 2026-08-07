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

vi.stubGlobal('ResizeObserver', ResizeObserverStub);

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
