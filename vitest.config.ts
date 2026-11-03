import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    clearMocks: true,
    restoreMocks: true,
    maxWorkers: 2,
    coverage: {
      provider: 'v8',
      include: ['src/features/**/*.{ts,tsx}', 'src/utils/**/*.ts'],
      exclude: ['src/**/*.test.{ts,tsx}'],
      reporter: ['text', 'html', 'json', 'json-summary'],
      thresholds: {
        lines: 70,
        'src/features/**': { lines: 70 },
        'src/utils/**': { lines: 70 },
      },
    },
  },
});
