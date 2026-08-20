import { describe, expect, it } from 'vitest';

import { resolveHomeHeaderVisualState } from './resolve-home-header-visual-state';

describe('resolveHomeHeaderVisualState', () => {
  it.each([
    [0, 'brand'],
    [0.49, 'brand'],
    [0.5, 'default'],
    [0.99, 'default'],
  ] as const)('keeps the intro transparent and maps progress %s to %s', (progress, appearance) => {
    expect(resolveHomeHeaderVisualState(progress, 'white')).toEqual({
      appearance,
      backgroundClassName: 'bg-transparent',
      shouldTransition: false,
    });
  });

  it.each([
    ['dark', 'inverse', 'bg-[#262626]'],
    ['process-dark', 'inverse', 'bg-primitive-gray-950'],
    ['orange', 'brand', 'bg-sys-primary-default'],
    ['white', 'default', 'bg-surface-lowest'],
  ] as const)('maps the %s section theme to %s', (theme, appearance, backgroundClassName) => {
    expect(resolveHomeHeaderVisualState(1, theme)).toEqual({
      appearance,
      backgroundClassName,
      shouldTransition: true,
    });
  });
});
