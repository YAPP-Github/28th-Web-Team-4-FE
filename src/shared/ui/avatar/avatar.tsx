import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { JSX } from 'react';

import { cn } from '@/shared/ui/cn';

import { AvatarPlaceholder } from './avatar-placeholder';

const DEFAULT_ALT = '프로필';

export type AvatarProps = {
  className?: string;
  /** 접근성 대체 텍스트. 기본 '프로필'. 빈 문자열이면 decorative */
  alt?: string;
};

export const Avatar = ({ className, alt = DEFAULT_ALT }: AvatarProps): JSX.Element => {
  const isDecorative = alt === '';

  return (
    <BaseAvatar.Root
      className={cn(
        'relative inline-flex size-9 shrink-0 overflow-hidden rounded-full',
        'transition-shadow duration-150 hover:shadow-[0_0_0_4px_var(--color-outline-low)]',
        className,
      )}
      {...(isDecorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': alt })}
    >
      {/* TODO: AvatarPlaceholder는 lucide 등 아이콘 라이브러리로 교체 예정 */}
      <BaseAvatar.Fallback className="flex size-full items-center justify-center">
        <AvatarPlaceholder className="size-full" />
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
};
