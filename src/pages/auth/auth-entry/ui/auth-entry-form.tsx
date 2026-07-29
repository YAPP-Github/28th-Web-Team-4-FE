'use client';

import { useRef, useState, type JSX } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';

import { AuthForm } from '@/features/auth/auth-form';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { useDebounce } from '@/shared/lib/use-debounce';
import { Button } from '@/shared/ui/button';
import { GoogleLogo } from '@/shared/ui/google-logo';
import { InputField } from '@/shared/ui/input-field';
import { Text } from '@/shared/ui/text';
import { authEntrySchema } from '@/pages/auth/auth-entry/model/auth-entry-schema';
import { useResolveAuthEmail } from '@/pages/auth/auth-entry/model/use-resolve-auth-email';

const EMAIL_VALIDATION_DEBOUNCE_MS = 400;

type AuthEntryInput = z.input<typeof authEntrySchema>;
type AuthEntryOutput = z.output<typeof authEntrySchema>;

function ExistingAccountForm({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}): JSX.Element {
  const [password, setPassword] = useState('');

  return (
    <AuthForm
      actions={
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
      }
      className="gap-12"
      title="로그인하기"
      titleId="auth-entry-title"
      onSubmit={(event) => event.preventDefault()}
    >
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
    </AuthForm>
  );
}

export function AuthEntryForm(): JSX.Element {
  const router = useRouter();
  const [existingAccountEmail, setExistingAccountEmail] = useState<string>();
  const hasEditedEmailRef = useRef(false);
  const resolveEmailMutation = useResolveAuthEmail();
  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError,
    trigger,
  } = useForm<AuthEntryInput, unknown, AuthEntryOutput>({
    defaultValues: { email: '' },
    resolver: zodResolver(authEntrySchema),
    reValidateMode: 'onSubmit',
  });
  const email = useWatch({ control, name: 'email' });
  const emailRegistration = register('email', {
    onChange: () => {
      hasEditedEmailRef.current = true;
    },
  });

  useDebounce(email, EMAIL_VALIDATION_DEBOUNCE_MS, () => {
    if (!hasEditedEmailRef.current) {
      return;
    }

    void trigger('email');
  });

  const submit = handleSubmit(({ email: validatedEmail }) => {
    clearErrors('email');
    resolveEmailMutation.mutate(validatedEmail, {
      onSuccess: (resolution) => {
        if (resolution.type === 'login') {
          setExistingAccountEmail(resolution.email);
          return;
        }

        if (resolution.type === 'google') {
          setError('email', {
            message: 'Google 계정으로 가입된 이메일이에요. Google 로그인을 이용해 주세요.',
            type: 'server',
          });
          return;
        }

        const searchParams = new URLSearchParams({ email: resolution.email });
        router.push(`/signup?${searchParams.toString()}`);
      },
      onError: (error: unknown) => {
        setError('email', {
          message: getApiErrorMessage(error, '이메일을 확인하는 중 문제가 발생했습니다.'),
          type: 'server',
        });
      },
    });
  });

  if (existingAccountEmail) {
    return (
      <ExistingAccountForm
        email={existingAccountEmail}
        onBack={() => setExistingAccountEmail(undefined)}
      />
    );
  }

  return (
    <AuthForm
      actions={
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
      }
      className="gap-12"
      title="이메일로 시작하기"
      titleId="auth-entry-title"
      noValidate
      onSubmit={submit}
    >
      <InputField
        type="email"
        autoComplete="email"
        placeholder="이메일을 입력해 주세요"
        aria-label="이메일"
        disabled={resolveEmailMutation.isPending}
        feedback={
          errors.email
            ? {
                tone: 'error',
                message: errors.email.message,
              }
            : undefined
        }
        {...emailRegistration}
      />
    </AuthForm>
  );
}
