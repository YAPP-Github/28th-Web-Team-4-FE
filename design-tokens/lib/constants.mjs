export const SEMANTIC_COLOR_GROUPS = new Set(['sys', 'surface', 'btn', 'text', 'outline', 'icon']);
export const PRIMITIVE_COLOR_GROUPS = new Set(['red', 'yellow', 'gray', 'green', 'orange', 'blue']);
export const COMPOSITE_TYPOGRAPHY_GROUPS = new Set([
  'Display',
  'Heading',
  'Subtitle',
  'Body',
  'Caption',
]);
export const COMPOSITE_TYPOGRAPHY_PROPS = new Set([
  'fontSize',
  'lineHeight',
  'fontWeight',
  'fontFamily',
  'letterSpacing',
]);

export const FONT_FALLBACK = 'ui-sans-serif, system-ui, sans-serif';

/** @type {Record<string, { file: string; label: string }>} */
export const TOKEN_OUTPUTS = {
  colors: { file: 'colors.css', label: 'color tokens (semantic + primitive)' },
  layout: { file: 'layout.css', label: 'spacing and radius' },
  typography: { file: 'typography.css', label: 'typography primitives and text styles' },
  effects: { file: 'effects.css', label: 'shadows' },
};
