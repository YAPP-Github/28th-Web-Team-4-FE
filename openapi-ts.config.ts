import { defineConfig } from '@hey-api/openapi-ts';

const toKebabCase = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export default defineConfig({
  input: '...',
  output: {
    path: 'src/shared/api/generated',
    fileName: {
      case: 'preserve',
      name: toKebabCase,
      suffix: '.gen',
    },
    postProcess: ['oxfmt'],
  },
});
