import {
  COMPOSITE_TYPOGRAPHY_GROUPS,
  COMPOSITE_TYPOGRAPHY_PROPS,
  PRIMITIVE_COLOR_GROUPS,
  SEMANTIC_COLOR_GROUPS,
} from './constants.mjs';
import { getTokenType } from './utils.mjs';

const TYPOGRAPHY_PRIMITIVE_CATEGORIES = new Set([
  'fontFamily',
  'fontWeight',
  'fontSize',
  'lineHeight',
  'letterSpacing',
]);

export function isCompositeTypographyLeaf(token) {
  const [group, , prop] = token.path;
  return (
    token.path.length === 3 &&
    COMPOSITE_TYPOGRAPHY_GROUPS.has(group) &&
    COMPOSITE_TYPOGRAPHY_PROPS.has(prop)
  );
}

export function isColorToken(token) {
  const [group] = token.path;
  const type = getTokenType(token);
  return (
    (SEMANTIC_COLOR_GROUPS.has(group) && type === 'color') ||
    (PRIMITIVE_COLOR_GROUPS.has(group) && type === 'color')
  );
}

export function isLayoutToken(token) {
  const [group] = token.path;
  return group === 'spacing' || group === 'radius' || group === 'opacity';
}

export function isTypographyPrimitiveToken(token) {
  const [group, category] = token.path;

  if (isCompositeTypographyLeaf(token)) {
    return false;
  }

  if (group !== 'typography') {
    return false;
  }

  return TYPOGRAPHY_PRIMITIVE_CATEGORIES.has(category);
}

export function isShadowToken(token) {
  const type = getTokenType(token);
  const originalType = token.$extensions?.['studio.tokens']?.originalType;

  return (
    token.path.length === 1 &&
    token.path[0].startsWith('drop-shadow') &&
    (type === 'shadow' || originalType === 'boxShadow')
  );
}

export function isEffectToken(token) {
  return isShadowToken(token);
}
