import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { JSX } from 'react';

import { cn } from '@/shared/ui/cn';

import { AvatarPlaceholder } from './avatar-placeholder';

const DEFAULT_ALT = '프로필';

export type AvatarProps = {
  className?: string;
  /** 아바타 이미지 URL */
  src?: string;
  /** 접근성 대체 텍스트. 기본 '프로필'. 빈 문자열이면 decorative */
  alt?: string;
};

export const Avatar = ({ className, src, alt = DEFAULT_ALT }: AvatarProps): JSX.Element => {
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
      {src && <BaseAvatar.Image src={src} alt="" className="size-full object-cover" />}
      {/* TODO: AvatarPlaceholder는 브랜드 이미지로 교체 예정 */}
      <BaseAvatar.Fallback className="flex size-full items-center justify-center">
        <AvatarPlaceholder className="size-full" />
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
};
