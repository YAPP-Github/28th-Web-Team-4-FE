import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

const dirname =
  // oxlint-disable-next-line no-negated-condition
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx,js}',
        '**/*.stories.{ts,tsx}',
        '**/*.d.ts',
        'src/instrumentation.ts',
        'src/instrumentation-client.ts',
        'src/sentry.*.config.ts',
      ],
    },
    projects: [
      {
        extends: true,
        optimizeDeps: {
          include: ['@base-ui/react/input'],
        },
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        plugins: [tsconfigPaths(), react()],
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          include: ['**/*.test.+(ts|tsx|js)'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
