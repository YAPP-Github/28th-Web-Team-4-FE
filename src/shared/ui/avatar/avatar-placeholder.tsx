import { useId, type SVGProps } from 'react';

export type AvatarPlaceholderProps = SVGProps<SVGSVGElement>;

/**
 * Figma profile 기본 플레이스홀더 (36×36 viewBox).
 * TODO: 브랜드 이미지로 교체 예정 — 임시 구현.
 */
export const AvatarPlaceholder = ({ className, ...props }: AvatarPlaceholderProps) => {
  const clipId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden
      {...props}
    >
      <g clipPath={`url(#${clipId})`}>
        <circle cx="18" cy="18" r="18" className="fill-surface-default" />
        <circle cx="18" cy="14.0625" r="7.3125" className="fill-surface-lower" />
        <circle cx="18" cy="37.6875" r="14.0625" className="fill-surface-lower" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <path d="M0 18C0 8.05887 8.05887 0 18 0V0C27.9411 0 36 8.05887 36 18V18C36 27.9411 27.9411 36 18 36V36C8.05887 36 0 27.9411 0 18V18Z" />
        </clipPath>
      </defs>
    </svg>
  );
};
