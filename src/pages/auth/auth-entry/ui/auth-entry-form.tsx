'use client';

import { useState, type FormEvent, type JSX } from 'react';
import Image from 'next/image';
import { CircleAlert } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { FormPanelHeader } from '@/shared/ui/form-panel';
import { Input } from '@/shared/ui/input';
import { authEntrySchema } from '@/pages/auth/auth-entry/model/auth-entry-schema';

const AUTH_SYMBOL_SRC = '/images/auth/auth-symbol.svg';
const GOOGLE_LOGO_SRC = '/images/auth/google-logo.png';

function AuthHeader({ title }: { title: string }): JSX.Element {
  return (
    <FormPanelHeader
      graphic={<Image src={AUTH_SYMBOL_SRC} alt="" width={24} height={29} priority />}
      title={title}
      titleId="auth-entry-title"
    />
  );
}

export function AuthEntryForm(): JSX.Element {
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailEntry = new FormData(event.currentTarget).get('email');
    const email = typeof emailEntry === 'string' ? emailEntry : '';
    const result = authEntrySchema.safeParse({ email });

    setErrorMessage(result.success ? undefined : result.error.issues[0]?.message);
  };

  return (
    <>
      <AuthHeader title="이메일로 시작하기" />
      <form className="flex w-full flex-col gap-12" noValidate onSubmit={handleSubmit}>
        <div className="gap-008 flex flex-col">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="이메일을 입력해 주세요"
            aria-label="이메일"
            aria-describedby={errorMessage ? 'email-entry-message' : undefined}
            aria-invalid={errorMessage ? true : undefined}
          />
          {errorMessage ? (
            <div
              id="email-entry-message"
              className="text-sys-error-default gap-006 pr-012 flex w-full items-center pl-[2px]"
              role="alert"
            >
              <CircleAlert className="size-012 shrink-0" aria-hidden />
              <p className="typo-body-sm">{errorMessage}</p>
            </div>
          ) : null}
        </div>

        <div className="gap-012 flex w-full flex-col">
          <button
            type="button"
            className="typo-subtitle-xxs text-text-medium self-center underline underline-offset-2"
          >
            비밀번호를 잊으셨나요?
          </button>
          <Button frame="cta" tone="login" type="submit">
            이메일로 시작하기
          </Button>
          <Button
            frame="button"
            tone="social"
            type="button"
            leftIcon={
              <Image
                src={GOOGLE_LOGO_SRC}
                alt=""
                width={21}
                height={21}
                className="size-[21px] max-w-none"
              />
            }
          >
            Google로 시작하기
          </Button>
        </div>
      </form>
    </>
  );
}
