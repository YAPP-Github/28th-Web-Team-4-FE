import { defineConfig } from '@hey-api/openapi-ts';

const toKebabCase = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export default defineConfig({
  input: 'https://api.chaeso-zip.com/v3/api-docs',
  output: {
    path: 'src/shared/api/generated',
    fileName: {
      case: 'preserve',
      name: toKebabCase,
      suffix: '.gen',
    },
    postProcess: ['oxfmt'],
  },
  plugins: [
    {
      name: '@hey-api/typescript',
      enums: 'javascript',
    },
    {
      name: '@hey-api/client-next',
      baseUrl: false,
      runtimeConfigPath: './src/shared/api/hey-api',
    },
    '@hey-api/sdk',
    '@tanstack/react-query',
  ],
});
