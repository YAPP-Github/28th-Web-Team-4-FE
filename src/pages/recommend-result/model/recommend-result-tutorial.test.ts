import { describe, expect, it, vi } from 'vitest';

import {
  CURRENT_RECOMMEND_RESULT_TUTORIAL_VERSION,
  markRecommendResultTutorialPresented,
  RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY,
  shouldShowRecommendResultTutorial,
} from './recommend-result-tutorial';

describe('recommend result tutorial storage', () => {
  it.each([null, '0', 'true', 'false', 'invalid'])(
    'shows the tutorial for an outdated value: %s',
    (storedVersion) => {
      const storage = {
        getItem: vi.fn<(key: string) => string | null>(() => storedVersion),
      };

      expect(shouldShowRecommendResultTutorial(storage)).toBe(true);
    },
  );

  it('hides the tutorial for the current version', () => {
    const storage = {
      getItem: vi.fn<(key: string) => string | null>(
        () => CURRENT_RECOMMEND_RESULT_TUTORIAL_VERSION,
      ),
    };

    expect(shouldShowRecommendResultTutorial(storage)).toBe(false);
    expect(storage.getItem).toHaveBeenCalledWith(RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY);
  });

  it('fails open when storage cannot be read', () => {
    const storage = {
      getItem: vi.fn<(key: string) => string | null>(() => {
        throw new DOMException('Storage is unavailable');
      }),
    };

    expect(shouldShowRecommendResultTutorial(storage)).toBe(true);
  });

  it('stores the current tutorial version', () => {
    const storage = {
      setItem: vi.fn<(key: string, value: string) => void>(),
    };

    markRecommendResultTutorialPresented(storage);

    expect(storage.setItem).toHaveBeenCalledWith(
      RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY,
      CURRENT_RECOMMEND_RESULT_TUTORIAL_VERSION,
    );
  });

  it('does not throw when storage cannot be written', () => {
    const storage = {
      setItem: vi.fn<(key: string, value: string) => void>(() => {
        throw new DOMException('Storage is unavailable');
      }),
    };

    expect(() => markRecommendResultTutorialPresented(storage)).not.toThrow();
  });
});
