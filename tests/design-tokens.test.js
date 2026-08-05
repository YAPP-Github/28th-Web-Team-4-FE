import { describe, expect, it } from 'vitest';

import { buildSemanticTypographyUtilities } from '../design-tokens/lib/composite-typography.mjs';
import { isTypographyPrimitiveToken } from '../design-tokens/lib/filters.mjs';
import { formatTokenValue } from '../design-tokens/lib/utils.mjs';

describe('design token typography hardening', () => {
  it('treats typography lineHeight tokens as primitives regardless of export type', () => {
    expect(
      isTypographyPrimitiveToken({
        path: ['typography', 'lineHeight', '020'],
        $type: 'lineHeights',
        $value: '20',
      }),
    ).toBe(true);

    expect(
      isTypographyPrimitiveToken({
        path: ['typography', 'lineHeight', '036'],
        $type: 'number',
        $value: 36,
      }),
    ).toBe(true);
  });

  it('formats typography lineHeight tokens as px for mixed token types', () => {
    expect(
      formatTokenValue({
        path: ['typography', 'lineHeight', '020'],
        $type: 'lineHeights',
        $value: '20',
      }),
    ).toBe('20px');

    expect(
      formatTokenValue({
        path: ['typography', 'lineHeight', '036'],
        $type: 'number',
        $value: 36,
      }),
    ).toBe('36px');
  });

  it('does not classify composite typography leaves as primitives', () => {
    expect(
      isTypographyPrimitiveToken({
        path: ['Body', 'body-lg', 'lineHeight'],
        $type: 'lineHeights',
        $value: '20px',
      }),
    ).toBe(false);
  });

  it('builds semantic typography utilities with leading classes from lineHeight primitives', () => {
    const primitiveTokens = [
      {
        name: 'leading-020',
        path: ['typography', 'lineHeight', '020'],
        $type: 'lineHeights',
        $value: '20',
      },
    ];
    const allTokens = [
      ...primitiveTokens,
      {
        name: 'Body-body-lg-lineHeight',
        path: ['Body', 'body-lg', 'lineHeight'],
        $type: 'dimension',
        $value: '20px',
      },
    ];

    expect(buildSemanticTypographyUtilities(allTokens, primitiveTokens)).toContain(
      '@utility typo-body-lg {\n  @apply leading-020;\n}',
    );
  });
});
