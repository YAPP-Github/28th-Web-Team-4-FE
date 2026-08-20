export const SIMULATOR_TUTORIAL_STORAGE_KEY = 'simulator-tutorial-version';

export const CURRENT_SIMULATOR_TUTORIAL_VERSION = '1';

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

export function shouldShowSimulatorTutorial(storage: ReadableStorage): boolean {
  try {
    return storage.getItem(SIMULATOR_TUTORIAL_STORAGE_KEY) !== CURRENT_SIMULATOR_TUTORIAL_VERSION;
  } catch {
    return true;
  }
}

export function markSimulatorTutorialCompleted(storage: WritableStorage): void {
  try {
    storage.setItem(SIMULATOR_TUTORIAL_STORAGE_KEY, CURRENT_SIMULATOR_TUTORIAL_VERSION);
  } catch {
    // Storage can be unavailable in privacy-restricted environments.
  }
}
