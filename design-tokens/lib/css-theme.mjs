/**
 * sd-tailwindv4의 CSSBuilder 패턴을 참고한 @theme 출력 헬퍼
 * @see https://github.com/tokens-studio/sd-tailwindv4/blob/main/config/css-builder.ts
 */

export function themeBlock(lines, label) {
  const header = [
    '/**',
    ' * Do not edit directly, this file was auto-generated.',
    label ? ` * ${label}` : null,
    ' */',
  ]
    .filter(Boolean)
    .join('\n');

  if (lines.length === 0) {
    return `${header}\n@theme {}\n`;
  }

  return `${header}\n@theme {\n${lines.join('\n')}\n}\n`;
}

export function tokenLines(tokens, formatValue) {
  return tokens.map((token) => `  --${token.name}: ${formatValue(token)};`);
}

export function indexImports(files) {
  const header = `/**\n * Do not edit directly, this file was auto-generated.\n */\n`;
  const imports = files.map((file) => `@import './${file}';`).join('\n');
  return `${header}${imports}\n`;
}

function fileHeader(label) {
  return [
    '/**',
    ' * Do not edit directly, this file was auto-generated.',
    label ? ` * ${label}` : null,
    ' */',
  ]
    .filter(Boolean)
    .join('\n');
}

/** @theme + @utility typo-* 블록을 typography.css에 출력 */
export function typographyFileContent(themeLines, utilityBlocks, label) {
  const parts = [fileHeader(label)];

  if (themeLines.length > 0) {
    parts.push(`@theme {\n${themeLines.join('\n')}\n}`);
  }

  if (utilityBlocks.length > 0) {
    parts.push(utilityBlocks.join('\n\n'));
  }

  return `${parts.join('\n\n')}\n`;
}
