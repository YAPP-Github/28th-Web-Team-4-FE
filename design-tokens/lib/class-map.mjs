/**
 * CSS 변수 → Tailwind 4 유틸리티 클래스 매핑
 * @param {string} varName e.g. --color-surface-lower
 * @returns {string[]} primary utility class names
 */
export function utilitiesForVariable(varName) {
  if (varName.startsWith('--color-')) {
    const name = varName.slice('--color-'.length);
    return [`bg-${name}`];
  }

  if (varName.startsWith('--spacing-')) {
    const name = varName.slice('--spacing-'.length);
    return [`p-${name}`];
  }

  if (varName.startsWith('--radius-')) {
    const name = varName.slice('--radius-'.length);
    return [`rounded-${name}`];
  }

  if (varName.startsWith('--shadow-')) {
    const name = varName.slice('--shadow-'.length);
    if (/-(color|type|blur|spread|offset)/.test(name)) {
      return [];
    }
    return [`shadow-${name}`];
  }

  if (varName.startsWith('--opacity-')) {
    const name = varName.slice('--opacity-'.length);
    return [`opacity-${name}`];
  }

  if (varName.startsWith('--font-weight-')) {
    const name = varName.slice('--font-weight-'.length);
    return [`font-${name}`];
  }

  if (varName.startsWith('--font-')) {
    const name = varName.slice('--font-'.length);
    return [`font-${name}`];
  }

  if (varName.startsWith('--leading-')) {
    const name = varName.slice('--leading-'.length);
    return [`leading-${name}`];
  }

  if (varName.startsWith('--tracking-')) {
    const name = varName.slice('--tracking-'.length);
    return [`tracking-${name}`];
  }

  if (varName.startsWith('--text-')) {
    const name = varName.slice('--text-'.length);
    return [`text-${name}`];
  }

  return [];
}

/** @param {string} cssFileContent */
export function parseThemeVariables(cssFileContent) {
  return [...cssFileContent.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((match) => match[1]);
}

/** @param {string} cssFileContent */
export function parseUtilityDefinitions(cssFileContent) {
  return [...cssFileContent.matchAll(/^@utility\s+([\w-]+)\s*\{/gm)].map((match) => match[1]);
}
