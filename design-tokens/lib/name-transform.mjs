import { PRIMITIVE_COLOR_GROUPS, SEMANTIC_COLOR_GROUPS } from './constants.mjs';

export function transformTokenName(token) {
  const path = token.path;
  const kebab = path.join('-').replace(/\s+/g, '-');

  if (SEMANTIC_COLOR_GROUPS.has(path[0])) {
    return `color-${kebab}`;
  }

  if (path[0] === 'spacing' || path[0] === 'radius') {
    if (path[0] === 'radius' && path[1]?.startsWith('radius-')) {
      return `radius-${path[1].slice('radius-'.length)}`;
    }
    return kebab;
  }

  if (path[0] === 'opacity') {
    return `opacity-${path[1]}`;
  }

  if (path[0] === 'typography') {
    const category = path[1];
    const scale = path[2];

    if (category === 'fontFamily') {
      return `font-${scale}`;
    }

    if (category === 'fontWeight') {
      return `font-weight-${scale}`;
    }

    if (category === 'fontSize') {
      return `text-${scale}`;
    }

    if (category === 'lineHeight') {
      return `leading-${scale}`;
    }

    if (category === 'letterSpacing') {
      return `tracking-${scale}`;
    }
  }

  if (PRIMITIVE_COLOR_GROUPS.has(path[0])) {
    return `color-primitive-${kebab}`;
  }

  if (path[0]?.startsWith('drop-shadow')) {
    return `shadow-${kebab}`;
  }

  return kebab;
}
