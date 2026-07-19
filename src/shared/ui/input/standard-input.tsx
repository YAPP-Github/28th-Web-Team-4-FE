import { forwardRef, type JSX } from 'react';

import { InputBase, type InputBaseProps } from './input-base';

export type StandardInputProps = Omit<InputBaseProps, 'rightElement'> & {
  frame?: 'input';
};

export const StandardInput = forwardRef<HTMLInputElement, StandardInputProps>(
  function StandardInput({ frame: _frame, ...props }, ref): JSX.Element {
    return <InputBase ref={ref} {...props} />;
  },
);
