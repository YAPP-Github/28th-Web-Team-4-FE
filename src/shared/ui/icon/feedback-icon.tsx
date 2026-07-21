import type { JSX } from 'react';
import Image from 'next/image';

import { cn } from '@/shared/ui/cn';

type FeedbackIconProps = {
  className?: string;
};

type FeedbackIconAssetProps = FeedbackIconProps & {
  src: string;
};

function FeedbackIconAsset({ src, className }: FeedbackIconAssetProps): JSX.Element {
  return (
    <Image
      src={src}
      alt=""
      width={12}
      height={12}
      className={cn('size-012 shrink-0', className)}
      aria-hidden
    />
  );
}

export function WarningErrorIcon({ className }: FeedbackIconProps): JSX.Element {
  return <FeedbackIconAsset src="/images/icons/warning-error.svg" className={className} />;
}

export function InfoFillIcon({ className }: FeedbackIconProps): JSX.Element {
  return <FeedbackIconAsset src="/images/icons/info-fill.svg" className={className} />;
}
