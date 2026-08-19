export const RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY = 'recommend-result-tutorial-version';

export const CURRENT_RECOMMEND_RESULT_TUTORIAL_VERSION = '1';

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

export function shouldShowRecommendResultTutorial(storage: ReadableStorage): boolean {
  try {
    return (
      storage.getItem(RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY) !==
      CURRENT_RECOMMEND_RESULT_TUTORIAL_VERSION
    );
  } catch {
    return true;
  }
}

export function markRecommendResultTutorialPresented(storage: WritableStorage): void {
  try {
    storage.setItem(
      RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY,
      CURRENT_RECOMMEND_RESULT_TUTORIAL_VERSION,
    );
  } catch {
    // Storage can be unavailable in privacy-restricted environments.
  }
}
