import type { PageHeaderAppearance } from '@/features/navigation/page-header';
import type { HeaderToneTheme } from '@/shared/lib/hero-header-tone';

export type HomeHeaderVisualState = {
  appearance: PageHeaderAppearance;
  backgroundClassName: string;
  shouldTransition: boolean;
};

export function resolveHomeHeaderVisualState(
  progress: number,
  theme: HeaderToneTheme,
): HomeHeaderVisualState {
  const isIntro = progress < 1;

  if (theme === 'dark') {
    return {
      appearance: 'inverse',
      backgroundClassName: 'bg-[#262626]',
      shouldTransition: !isIntro,
    };
  }

  if (theme === 'process-dark') {
    return {
      appearance: 'inverse',
      backgroundClassName: 'bg-primitive-gray-950',
      shouldTransition: !isIntro,
    };
  }

  if (theme === 'orange') {
    return {
      appearance: 'brand',
      backgroundClassName: 'bg-sys-primary-default',
      shouldTransition: !isIntro,
    };
  }

  if (isIntro) {
    return {
      appearance: progress < 0.5 ? 'brand' : 'default',
      backgroundClassName: 'bg-transparent',
      shouldTransition: false,
    };
  }

  return {
    appearance: 'default',
    backgroundClassName: 'bg-surface-lowest',
    shouldTransition: true,
  };
}
