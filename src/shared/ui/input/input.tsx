import { forwardRef, type JSX } from 'react';

import { keys } from '@/shared/lib/object';

import { PasswordInput, type PasswordInputProps } from './password-input';
import { StandardInput, type StandardInputProps } from './standard-input';

const FRAME_MAP = {
  input: 'input',
  password: 'password',
} as const;

export type InputFrame = keyof typeof FRAME_MAP;
export type InputProps = StandardInputProps | PasswordInputProps;

export const INPUT_FRAMES = keys(FRAME_MAP);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref): JSX.Element {
    if (props.frame === 'password') {
      return <PasswordInput ref={ref} {...props} />;
    }

    return <StandardInput ref={ref} {...props} />;
  },
);
