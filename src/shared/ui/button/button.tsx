import type { JSX } from 'react';

import { keys } from '@/shared/lib/object';

import { CtaButton, type CtaButtonProps } from './cta-button';
import { StandardButton, type StandardButtonProps } from './standard-button';

const FRAME_MAP = {
  button: 'button',
  cta: 'cta',
} as const;

export type ButtonFrame = keyof typeof FRAME_MAP;
export type ButtonProps = StandardButtonProps | CtaButtonProps;

export const BUTTON_FRAMES = keys(FRAME_MAP);

export const Button = (props: ButtonProps): JSX.Element => {
  if (props.frame === 'cta') {
    return <CtaButton {...props} />;
  }

  return <StandardButton {...props} />;
};
