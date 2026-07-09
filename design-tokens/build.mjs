import { register } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildSemanticTypographyUtilities } from './lib/composite-typography.mjs';
import { TOKEN_OUTPUTS } from './lib/constants.mjs';
import { indexImports, themeBlock, tokenLines, typographyFileContent } from './lib/css-theme.mjs';
import { typographyExpandTypesMap } from './lib/expand-types.mjs';
import {
  isColorToken,
  isCompositeTypographyLeaf,
  isEffectToken,
  isLayoutToken,
  isTypographyPrimitiveToken,
} from './lib/filters.mjs';
import { transformTokenName } from './lib/name-transform.mjs';
import { formatTokenValue } from './lib/utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensPath = join(__dirname, 'tokens.json');
const outputDir = join(__dirname, '../src/styles/tokens');

await register(StyleDictionary, { excludeParentKeys: true });

StyleDictionary.registerTransform({
  name: 'name/tailwind-theme',
  type: 'name',
  transform: transformTokenName,
});

StyleDictionary.registerFormat({
  name: 'css/tailwind-theme',
  format: ({ dictionary, file }) => {
    const lines = tokenLines(dictionary.allTokens, formatTokenValue);
    return themeBlock(lines, file.options?.label);
  },
});

StyleDictionary.registerFormat({
  name: 'css/tailwind-typography',
  format: ({ dictionary, file }) => {
    const primitiveTokens = dictionary.allTokens.filter(
      (token) => !isCompositeTypographyLeaf(token),
    );
    const themeLines = tokenLines(primitiveTokens, formatTokenValue);
    const utilityBlocks = buildSemanticTypographyUtilities(dictionary.allTokens, primitiveTokens);

    return typographyFileContent(themeLines, utilityBlocks, file.options?.label);
  },
});

const sharedPlatform = {
  transformGroup: 'tokens-studio',
  transforms: ['name/tailwind-theme'],
  buildPath: `${outputDir}/`,
};

const sdMain = new StyleDictionary({
  log: { warnings: 'warn' },
  source: [tokensPath],
  preprocessors: ['tokens-studio'],
  expand: { typesMap: typographyExpandTypesMap },
  platforms: {
    css: {
      ...sharedPlatform,
      files: [
        {
          destination: TOKEN_OUTPUTS.colors.file,
          format: 'css/tailwind-theme',
          filter: isColorToken,
          options: { label: TOKEN_OUTPUTS.colors.label },
        },
        {
          destination: TOKEN_OUTPUTS.layout.file,
          format: 'css/tailwind-theme',
          filter: isLayoutToken,
          options: { label: TOKEN_OUTPUTS.layout.label },
        },
        {
          destination: TOKEN_OUTPUTS.typography.file,
          format: 'css/tailwind-typography',
          filter: (token) => isTypographyPrimitiveToken(token) || isCompositeTypographyLeaf(token),
          options: { label: TOKEN_OUTPUTS.typography.label },
        },
      ],
    },
  },
});

/** shadow는 expand 없이 별도 빌드 (expand 시 box-shadow shorthand 깨짐) */
const sdEffects = new StyleDictionary({
  log: { warnings: 'warn' },
  source: [tokensPath],
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      ...sharedPlatform,
      files: [
        {
          destination: TOKEN_OUTPUTS.effects.file,
          format: 'css/tailwind-theme',
          filter: isEffectToken,
          options: { label: TOKEN_OUTPUTS.effects.label },
        },
      ],
    },
  },
});

await sdMain.cleanAllPlatforms();
await sdEffects.cleanAllPlatforms();
await sdMain.buildAllPlatforms();
await sdEffects.buildAllPlatforms();

await writeFile(
  join(outputDir, 'index.css'),
  indexImports(Object.values(TOKEN_OUTPUTS).map(({ file }) => file)),
);
