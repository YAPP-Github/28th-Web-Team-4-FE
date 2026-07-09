import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

import {
  parseThemeVariables,
  parseUtilityDefinitions,
  utilitiesForVariable,
} from './lib/class-map.mjs';
import { TOKEN_OUTPUTS } from './lib/constants.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const tokensDir = join(projectRoot, 'src/styles/tokens');
const validateCssPath = join(__dirname, '.validate.css');

const FORBIDDEN_CLASS_PATTERNS = [/^font-weight-/];

async function collectUtilityClasses() {
  const classes = new Set();

  for (const { file } of Object.values(TOKEN_OUTPUTS)) {
    const css = await readFile(join(tokensDir, file), 'utf8');

    for (const varName of parseThemeVariables(css)) {
      for (const utility of utilitiesForVariable(varName)) {
        classes.add(utility);
      }
    }

    for (const utility of parseUtilityDefinitions(css)) {
      classes.add(utility);
    }
  }

  return [...classes].sort((a, b) => a.localeCompare(b));
}

function buildValidateCss(classes) {
  const batchSize = 40;
  const batches = [];

  for (let index = 0; index < classes.length; index += batchSize) {
    batches.push(classes.slice(index, index + batchSize));
  }

  const utilities = batches
    .map((batch, index) => {
      const applies = `@apply ${batch.join(' ')}`;
      return `@utility token-validate-${index} {\n  ${applies}\n}`;
    })
    .join('\n\n');

  return `@import 'tailwindcss';\n@import '../src/styles/tokens/index.css';\n\n${utilities}\n`;
}

async function runTailwindValidation(css) {
  await postcss([tailwindcss()]).process(css, {
    from: validateCssPath,
    to: join(__dirname, '.validate.out.css'),
  });
}

const classes = await collectUtilityClasses();

for (const className of classes) {
  for (const pattern of FORBIDDEN_CLASS_PATTERNS) {
    if (pattern.test(className)) {
      throw new Error(`잘못된 유틸리티 패턴 감지: ${className}`);
    }
  }
}

const validateCss = buildValidateCss(classes);
await writeFile(validateCssPath, validateCss);

try {
  await runTailwindValidation(validateCss);
  process.stdout.write(`tokens:validate — ${classes.length}개 유틸리티 클래스 검증 통과\n`);
} catch (error) {
  process.stderr.write('tokens:validate — 유효하지 않은 유틸리티 클래스가 있습니다.\n');
  throw error;
}
