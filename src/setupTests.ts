import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { useSavedStore } from './features/saved/useSavedStore';
import { useSessionStore } from './features/session/useSessionStore';

// jsdom không có phép đo layout; chỉ thay các API kích thước, không mock logic ứng dụng.
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  })),
});

beforeEach(() => {
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
  useSavedStore.setState({ ids: [] });
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
