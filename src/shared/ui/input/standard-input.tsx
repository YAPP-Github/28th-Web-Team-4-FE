import type { JSX } from 'react';

import { InputBase, type InputBaseProps } from './input-base';

export type StandardInputProps = Omit<InputBaseProps, 'rightElement'>;

export function StandardInput({ ...props }: StandardInputProps): JSX.Element {
  return <InputBase {...props} />;
}
