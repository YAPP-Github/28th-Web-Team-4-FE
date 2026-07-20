import type { JSX } from 'react';

import { InputBase, type InputBaseProps } from './input-base';

export type StandardInputProps = Omit<InputBaseProps, 'rightElement'> & {
  frame?: 'input';
};

export function StandardInput({ frame: _frame, ...props }: StandardInputProps): JSX.Element {
  return <InputBase {...props} />;
}
