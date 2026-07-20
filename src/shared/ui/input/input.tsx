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

type StandardInputFrameProps = StandardInputProps & { frame?: 'input' };
type PasswordInputFrameProps = PasswordInputProps & { frame: 'password' };
type FilterInputFrameProps = FilterInputProps & { frame: 'filter' };

export type InputProps = StandardInputFrameProps | PasswordInputFrameProps | FilterInputFrameProps;

export const INPUT_FRAMES = keys(FRAME_MAP);

export function Input(props: InputProps): JSX.Element {
  if (props.frame === 'filter') {
    const { frame: _frame, ...filterProps } = props;
    return <FilterInput {...filterProps} />;
  }

  if (props.frame === 'password') {
    const { frame: _frame, ...passwordProps } = props;
    return <PasswordInput {...passwordProps} />;
  }

  const { frame: _frame, ...standardProps } = props;
  return <StandardInput {...standardProps} />;
}
