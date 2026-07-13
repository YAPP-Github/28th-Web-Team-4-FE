import type { Preview } from '@storybook/nextjs-vite';

// oxlint-disable-next-line import/no-relative-parent-imports
import '../src/app/globals.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="root">
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
