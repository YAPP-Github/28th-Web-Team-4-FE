import type { JSX, SVGProps } from 'react';

import { cn } from '@/shared/ui/cn';

const DEFAULT_ALT = 'Google';

export type GoogleLogoProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  /** 접근성 대체 텍스트. 기본 'Google'. 빈 문자열이면 decorative */
  alt?: string;
};

export function GoogleLogo({
  className,
  alt = DEFAULT_ALT,
  ...props
}: GoogleLogoProps): JSX.Element {
  const isDecorative = alt === '';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      className={cn('size-[21px] shrink-0', className)}
      focusable="false"
      {...props}
      {...(isDecorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': alt })}
    >
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.909c1.702-1.567 2.683-3.878 2.683-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.468-.806 5.957-2.18l-2.91-2.259c-.805.54-1.835.859-3.047.859-2.344 0-4.328-1.585-5.037-3.714H.956v2.332A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.963 10.706A5.41 5.41 0 0 1 3.682 9c0-.592.102-1.168.281-1.706V4.962H.956A9 9 0 0 0 0 9c0 1.452.347 2.827.956 4.038l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.322 0 2.508.455 3.441 1.346l2.581-2.581C13.464.892 11.427 0 9 0A9 9 0 0 0 .956 4.962l3.007 2.332C4.672 5.165 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}
