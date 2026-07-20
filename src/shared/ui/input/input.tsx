import type { JSX } from 'react';

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

export function Input(props: InputProps): JSX.Element {
  if (props.frame === 'filter') {
    return <FilterInput {...props} />;
  }

  if (props.frame === 'password') {
    return <PasswordInput {...props} />;
  }

  return <StandardInput {...props} />;
}
