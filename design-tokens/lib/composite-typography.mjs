import { isCompositeTypographyLeaf } from './filters.mjs';
import { formatPx, getTokenValue } from './utils.mjs';

const TYPOGRAPHY_PROPS = ['fontSize', 'lineHeight', 'fontWeight', 'letterSpacing', 'fontFamily'];

/** @param {string} tokenName */
export function primitiveUtilityClass(tokenName) {
  if (tokenName.startsWith('font-weight-')) {
    return `font-${tokenName.slice('font-weight-'.length)}`;
  }

  return tokenName;
}

/** @param {string} prop @param {unknown} value */
function normalizeMatchValue(prop, value) {
  if (prop === 'fontWeight') {
    return String(value);
  }

  if (prop === 'fontFamily') {
    return String(value).split(',')[0].trim();
  }

  if (typeof value === 'number') {
    return formatPx(value);
  }

  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) {
    return formatPx(value);
  }

  return String(value);
}

/** @param {import('style-dictionary').TransformedToken[]} primitiveTokens */
function buildPrimitiveUtilityIndex(primitiveTokens) {
  /** @type {Record<string, Map<string, string>>} */
  const index = Object.fromEntries(TYPOGRAPHY_PROPS.map((prop) => [prop, new Map()]));

  for (const token of primitiveTokens) {
    const [group, category] = token.path;

    if (group !== 'typography') {
      continue;
    }

    let prop;

    if (category === 'fontSize') {
      prop = 'fontSize';
    } else if (category === 'lineHeight') {
      prop = 'lineHeight';
    } else if (category === 'fontWeight') {
      prop = 'fontWeight';
    } else if (category === 'letterSpacing') {
      prop = 'letterSpacing';
    } else if (category === 'fontFamily') {
      prop = 'fontFamily';
    } else {
      continue;
    }

    const matchKey = normalizeMatchValue(prop, getTokenValue(token));
    index[prop].set(matchKey, primitiveUtilityClass(token.name));
  }

  return index;
}

/** @param {string} prop @param {import('style-dictionary').TransformedToken} leafToken @param {Record<string, Map<string, string>>} index */
function utilityForLeaf(prop, leafToken, index) {
  const matchKey = normalizeMatchValue(prop, getTokenValue(leafToken));
  const utility = index[prop].get(matchKey);

  if (!utility) {
    throw new Error(
      `primitive utility not found for ${leafToken.path.join('.')} (${prop}=${matchKey})`,
    );
  }

  return utility;
}

/**
 * semantic typography → @utility typo-* { @apply primitive... }
 * @param {import('style-dictionary').TransformedToken[]} allTokens
 * @param {import('style-dictionary').TransformedToken[]} primitiveTokens
 */
export function buildSemanticTypographyUtilities(allTokens, primitiveTokens) {
  const index = buildPrimitiveUtilityIndex(primitiveTokens);
  const groups = new Map();

  for (const token of allTokens) {
    if (!isCompositeTypographyLeaf(token)) {
      continue;
    }

    const [, styleName, prop] = token.path;

    if (!groups.has(styleName)) {
      groups.set(styleName, {});
    }

    groups.get(styleName)[prop] = token;
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([styleName, props]) => {
      const classes = TYPOGRAPHY_PROPS.filter((prop) => props[prop]).map((prop) =>
        utilityForLeaf(prop, props[prop], index),
      );

      return `@utility typo-${styleName} {\n  @apply ${classes.join(' ')};\n}`;
    });
}
