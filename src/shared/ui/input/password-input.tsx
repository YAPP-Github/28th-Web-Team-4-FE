'use client';

import { useState, type JSX } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { InputBase, type InputBaseProps } from './input-base';

export type PasswordInputProps = Omit<InputBaseProps, 'rightAddon' | 'rightElement' | 'type'> & {
  frame: 'password';
};

export function PasswordInput({
  frame: _frame,
  disabled,
  ...props
}: PasswordInputProps): JSX.Element {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <InputBase
      type={isPasswordVisible ? 'text' : 'password'}
      disabled={disabled}
      rightElement={
        <button
          type="button"
          className="size-020 text-icon-low hover:not-disabled:text-icon-low inline-flex shrink-0 items-center justify-center transition-colors disabled:cursor-not-allowed"
          aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          disabled={disabled}
          onClick={() => setIsPasswordVisible((current) => !current)}
        >
          {isPasswordVisible ? (
            <EyeOff className="size-020" aria-hidden />
          ) : (
            <Eye className="size-020" aria-hidden />
          )}
        </button>
      }
      {...props}
    />
  );
}
