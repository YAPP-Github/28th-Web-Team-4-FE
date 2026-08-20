import { describe, expect, it, vi } from 'vitest';

import {
  CURRENT_SIMULATOR_TUTORIAL_VERSION,
  markSimulatorTutorialCompleted,
  shouldShowSimulatorTutorial,
  SIMULATOR_TUTORIAL_STORAGE_KEY,
} from './simulator-tutorial';

describe('simulator tutorial storage', () => {
  it.each([
    ['no stored value', null],
    ['an outdated value', '0'],
  ])('shows the tutorial for %s', (_, storedValue) => {
    const storage = {
      getItem: vi.fn<() => string | null>(() => storedValue),
    };

    expect(shouldShowSimulatorTutorial(storage)).toBe(true);
  });

  it('hides the tutorial for the current version', () => {
    const storage = {
      getItem: vi.fn<() => string | null>(() => CURRENT_SIMULATOR_TUTORIAL_VERSION),
    };

    expect(shouldShowSimulatorTutorial(storage)).toBe(false);
  });

  it('shows the tutorial when storage cannot be read', () => {
    const storage = {
      getItem: vi.fn<() => string | null>(() => {
        throw new Error('storage unavailable');
      }),
    };

    expect(shouldShowSimulatorTutorial(storage)).toBe(true);
  });

  it('stores the current tutorial version after completion', () => {
    const setItem = vi.fn<(key: string, value: string) => void>();

    markSimulatorTutorialCompleted({ setItem });

    expect(setItem).toHaveBeenCalledWith(
      SIMULATOR_TUTORIAL_STORAGE_KEY,
      CURRENT_SIMULATOR_TUTORIAL_VERSION,
    );
  });
});
