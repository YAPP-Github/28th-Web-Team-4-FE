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

  if (path[0] === 'opacity' && typeof value === 'number') {
    return value > 1 ? value / 100 : value;
  }

  if (type === 'number' && typeof value === 'number') {
    return `${value}px`;
  }

  if (type === 'fontFamily' || (path[0] === 'typography' && path[1] === 'fontFamily')) {
    return `${value}, ${FONT_FALLBACK}`;
  }

  return value;
}
