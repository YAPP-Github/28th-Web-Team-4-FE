'use client';

import { useRef, useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { getApiErrorMessage } from '@/shared/api/api-error';
import { useDebounce } from '@/shared/lib/use-debounce';
import { Button } from '@/shared/ui/button';
import { FormPanelHeader } from '@/shared/ui/form-panel';
import { GoogleLogo } from '@/shared/ui/google-logo';
import { InputField } from '@/shared/ui/input-field';
import { BrandSymbol } from '@/shared/ui/symbol';
import { Text } from '@/shared/ui/text';
import { authEntrySchema } from '@/pages/auth/auth-entry/model/auth-entry-schema';
import { useResolveAuthEmail } from '@/pages/auth/auth-entry/model/use-resolve-auth-email';

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

function ExistingAccountForm({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}): JSX.Element {
  const [password, setPassword] = useState('');

  return (
    <>
      <AuthHeader title="로그인하기" />
      <form className="flex w-full flex-col gap-12" onSubmit={(event) => event.preventDefault()}>
        <div className="gap-024 flex flex-col">
          <label className="gap-008 flex flex-col">
            <Text variant="body-xl" className="text-text-medium">
              아이디
            </Text>
            <InputField
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              readOnly
              className="cursor-pointer"
              onClick={onBack}
            />
          </label>
          <label className="gap-008 flex flex-col">
            <Text variant="body-xl" className="text-text-medium">
              비밀번호
            </Text>
            <InputField
              frame="password"
              name="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
          </label>
        </div>

        <div className="gap-012 flex w-full flex-col">
          <button
            type="button"
            className="typo-subtitle-xxs text-text-medium self-center underline underline-offset-2"
          >
            비밀번호를 잊으셨나요?
          </button>
          <Button frame="cta" tone="login" type="button" disabled={!password}>
            로그인하기
          </Button>
        </div>
      </form>
    </>
  );
}

export function AuthEntryForm(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [existingAccountEmail, setExistingAccountEmail] = useState<string>();
  const hasEditedEmailRef = useRef(false);
  useDebounce(email, EMAIL_VALIDATION_DEBOUNCE_MS, (debouncedEmail) => {
    if (!hasEditedEmailRef.current) {
      return;
    }

    setErrorMessage(getEmailErrorMessage(debouncedEmail));
  });
  const resolveEmailMutation = useResolveAuthEmail();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
    hasEditedEmailRef.current = true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = authEntrySchema.safeParse({ email });

    if (!result.success) {
      setErrorMessage(result.error.issues[0]?.message);
      return;
    }

    setErrorMessage(undefined);
    resolveEmailMutation.mutate(result.data.email, {
      onSuccess: (resolution) => {
        if (resolution.type === 'login') {
          setExistingAccountEmail(resolution.email);
          return;
        }

        if (resolution.type === 'google') {
          setErrorMessage('Google 계정으로 가입된 이메일이에요. Google 로그인을 이용해 주세요.');
          return;
        }

        const searchParams = new URLSearchParams({ email: resolution.email });
        router.push(`/signup?${searchParams.toString()}`);
      },
      onError: (error: unknown) => {
        setErrorMessage(getApiErrorMessage(error, '이메일을 확인하는 중 문제가 발생했습니다.'));
      },
    });
  };

  if (existingAccountEmail) {
    return (
      <ExistingAccountForm
        email={existingAccountEmail}
        onBack={() => setExistingAccountEmail(undefined)}
      />
    );
  }

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
          disabled={resolveEmailMutation.isPending}
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
          <Button frame="cta" tone="login" type="submit" disabled={resolveEmailMutation.isPending}>
            이메일로 시작하기
          </Button>
          <Button
            frame="button"
            tone="social"
            type="button"
            disabled={resolveEmailMutation.isPending}
            leftIcon={<GoogleLogo alt="" />}
          >
            Google로 시작하기
          </Button>
        </div>
      </form>
    </>
  );
}
