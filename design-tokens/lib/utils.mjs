import { FONT_FALLBACK } from './constants.mjs';

export function getTokenType(token) {
  return token.$type ?? token.type;
}

export function getTokenValue(token) {
  return token.$value ?? token.value;
}

export function formatPx(value) {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) {
    return `${value}px`;
  }

  return value;
}

export function formatTokenValue(token) {
  const value = getTokenValue(token);
  const type = getTokenType(token);
  const path = token.path;

  if (
    type === 'fontWeight' ||
    (type === 'number' && path[0] === 'typography' && path[1] === 'fontWeight')
  ) {
    return value;
  }

  if (path[0] === 'opacity') {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isNaN(n)) {
      return n > 1 ? n / 100 : n;
    }
  }

  if (type === 'number') {
    return formatPx(value);
  }

  if (type === 'fontFamily' || (path[0] === 'typography' && path[1] === 'fontFamily')) {
    return `${value}, ${FONT_FALLBACK}`;
  }

  return value;
}
