import { forwardRef, type JSX } from 'react';

import { keys } from '@/shared/lib/object';

import { FilterInput, type FilterInputProps } from './filter-input';
import { PasswordInput, type PasswordInputProps } from './password-input';
import { StandardInput, type StandardInputProps } from './standard-input';

const FRAME_MAP = {
  filter: 'filter',
  input: 'input',
  password: 'password',
} as const;

export type InputFrame = keyof typeof FRAME_MAP;
export type InputProps = StandardInputProps | PasswordInputProps | FilterInputProps;

export const INPUT_FRAMES = keys(FRAME_MAP);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref): JSX.Element {
    if (props.frame === 'filter') {
      return <FilterInput ref={ref} {...props} />;
    }

    if (props.frame === 'password') {
      return <PasswordInput ref={ref} {...props} />;
    }

    return <StandardInput ref={ref} {...props} />;
  },
);
