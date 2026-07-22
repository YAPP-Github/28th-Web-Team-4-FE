'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type JSX } from 'react';

import { useDebounce } from '@/shared/lib/use-debounce';
import { Button } from '@/shared/ui/button';
import { FormPanelHeader } from '@/shared/ui/form-panel';
import { GoogleLogo } from '@/shared/ui/google-logo';
import { InputField } from '@/shared/ui/input-field';
import { BrandSymbol } from '@/shared/ui/symbol';
import { authEntrySchema } from '@/pages/auth/auth-entry/model/auth-entry-schema';

const EMAIL_VALIDATION_DEBOUNCE_MS = 400;

function getEmailErrorMessage(email: string): string | undefined {
  const result = authEntrySchema.safeParse({ email });

  return result.success ? undefined : result.error.issues[0]?.message;
}

function AuthHeader({ title }: { title: string }): JSX.Element {
  return (
    <FormPanelHeader
      graphic={<BrandSymbol className="h-[29px] w-6" alt="" />}
      title={title}
      titleId="auth-entry-title"
    />
  );
}

export function AuthEntryForm(): JSX.Element {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const hasEditedEmailRef = useRef(false);
  const debouncedEmail = useDebounce(email, EMAIL_VALIDATION_DEBOUNCE_MS);

  useEffect(() => {
    if (!hasEditedEmailRef.current) {
      return;
    }

    setErrorMessage(getEmailErrorMessage(debouncedEmail));
  }, [debouncedEmail]);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
    hasEditedEmailRef.current = true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(getEmailErrorMessage(email));
  };

  return (
    <>
      <AuthHeader title="이메일로 시작하기" />
      <form className="flex w-full flex-col gap-12" noValidate onSubmit={handleSubmit}>
        <InputField
          name="email"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력해 주세요"
          aria-label="이메일"
          value={email}
          onChange={handleEmailChange}
          feedback={
            errorMessage
              ? {
                  tone: 'error',
                  message: errorMessage,
                }
              : undefined
          }
        />

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
          <Button frame="button" tone="social" type="button" leftIcon={<GoogleLogo alt="" />}>
            Google로 시작하기
          </Button>
        </div>
      </form>
    </>
  );
}
