'use client';

import { useState, type JSX } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { AuthForm } from '@/features/auth/auth-form';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { Button } from '@/shared/ui/button';
import { GoogleLogo } from '@/shared/ui/google-logo';
import { InputField } from '@/shared/ui/input-field';
import { Text } from '@/shared/ui/text';
import { authEntrySchema } from '@/pages/auth/auth-entry/model/auth-entry-schema';
import { authenticateLocal } from '@/pages/auth/auth-entry/api/authenticate-local';
import { linkGoogleAccount } from '@/pages/auth/auth-entry/api/link-google-account';
import { useGoogleAuth } from '@/pages/auth/auth-entry/model/use-google-auth';
import { useResolveAuthEmail } from '@/pages/auth/auth-entry/model/use-resolve-auth-email';
import { markGoogleLinkFeedbackPending } from '@/shared/lib/auth/google-link-feedback';
import { Modal, TextModal } from '@/shared/ui/modal';

type GoogleCredentialResponse = { credential?: string };
type GooglePromptMomentNotification = {
  isSkippedMoment: () => boolean;
};
type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: {
        callback: (response: GoogleCredentialResponse) => void;
        client_id: string;
      }) => void;
      prompt: (momentListener?: (notification: GooglePromptMomentNotification) => void) => void;
    };
  };
};

const getGoogleIdentity = () => (window as typeof window & { google?: GoogleIdentity }).google;

type AuthEntryInput = z.input<typeof authEntrySchema>;
type AuthEntryOutput = z.output<typeof authEntrySchema>;

function ExistingAccountForm({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}): JSX.Element {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  const submit = async () => {
    if (!password || isPending) {
      return;
    }

    setErrorMessage(undefined);
    setIsPending(true);

    try {
      await authenticateLocal(email, password);
      router.replace('/');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '로그인 중 문제가 발생했습니다.'));
      setIsPending(false);
    }
  };

  return (
    <AuthForm
      actions={
        <div className="gap-012 flex w-full flex-col">
          {errorMessage ? (
            <p className="typo-body-lg text-sys-error-default text-center" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <button
            type="button"
            className="typo-subtitle-xxs text-text-medium self-center underline underline-offset-2"
          >
            비밀번호를 잊으셨나요?
          </button>
          <Button frame="cta" tone="login" type="submit" disabled={!password || isPending}>
            로그인하기
          </Button>
        </div>
      }
      className="gap-12"
      title="로그인하기"
      titleId="auth-entry-title"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
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
            disabled={isPending}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
              setErrorMessage(undefined);
            }}
          />
        </label>
      </div>
    </AuthForm>
  );
}

export function AuthEntryForm(): JSX.Element {
  const router = useRouter();
  const [existingAccountEmail, setExistingAccountEmail] = useState<string>();
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [googleInitializationError, setGoogleInitializationError] = useState<string>();
  const [googleLinkRequest, setGoogleLinkRequest] = useState<{
    email: string;
    idToken: string;
  }>();
  const [googleLinkError, setGoogleLinkError] = useState<string>();
  const [isGoogleLinkPending, setIsGoogleLinkPending] = useState(false);
  const resolveEmailMutation = useResolveAuthEmail();
  const googleAuthMutation = useGoogleAuth();
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<AuthEntryInput, unknown, AuthEntryOutput>({
    defaultValues: { email: '' },
    resolver: zodResolver(authEntrySchema),
    reValidateMode: 'onSubmit',
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
  const initializeGoogleIdentity = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
    const google = getGoogleIdentity();

    if (!googleClientId) {
      setIsGoogleReady(false);
      setGoogleInitializationError('Google 로그인 설정을 확인해 주세요.');
      return;
    }

    if (!google) {
      return;
    }

    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: ({ credential }) => {
        if (credential) {
          googleAuthMutation.mutate(credential, {
            onSuccess: (resolution) => {
              if (resolution.type === 'link') {
                setGoogleLinkError(undefined);
                setGoogleLinkRequest({ email: resolution.email, idToken: credential });
              }
            },
          });
        }
      },
    });
    setGoogleInitializationError(undefined);
    setIsGoogleReady(true);
  };
  const promptGoogleIdentity = () => {
    const google = getGoogleIdentity();

    if (!google) {
      setIsGoogleReady(false);
      setGoogleInitializationError('Google 로그인을 불러오지 못했습니다. 다시 시도해 주세요.');
      return;
    }

    setGoogleInitializationError(undefined);
    google.accounts.id.prompt((notification) => {
      if (notification.isSkippedMoment()) {
        setGoogleInitializationError('Google 로그인을 진행하지 못했습니다. 다시 시도해 주세요.');
      }
    });
  };
  const googleErrorMessage =
    googleInitializationError ??
    (googleAuthMutation.error
      ? getApiErrorMessage(googleAuthMutation.error, 'Google 인증 중 문제가 발생했습니다.')
      : undefined);
  const deferGoogleLink = () => {
    if (!googleLinkRequest) {
      return;
    }

    setExistingAccountEmail(googleLinkRequest.email);
    setGoogleLinkRequest(undefined);
    setGoogleLinkError(undefined);
  };
  const dismissGoogleLink = () => {
    if (isGoogleLinkPending) {
      return;
    }

    setGoogleLinkRequest(undefined);
    setGoogleLinkError(undefined);
  };
  const confirmGoogleLink = async () => {
    if (!googleLinkRequest || isGoogleLinkPending) {
      return;
    }

    setGoogleLinkError(undefined);
    setIsGoogleLinkPending(true);

    try {
      await linkGoogleAccount(googleLinkRequest.idToken);
      markGoogleLinkFeedbackPending();
      router.replace('/');
    } catch (error) {
      setGoogleLinkError(getApiErrorMessage(error, 'Google 계정을 연결하지 못했습니다.'));
      setIsGoogleLinkPending(false);
    }
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
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={initializeGoogleIdentity}
      />
      <AuthForm
        actions={
          <div className="gap-012 flex w-full flex-col">
            {googleErrorMessage ? (
              <p className="typo-body-lg text-sys-error-default text-center" role="alert">
                {googleErrorMessage}
              </p>
            ) : null}
            <button
              type="button"
              className="typo-subtitle-xxs text-text-medium self-center underline underline-offset-2"
            >
              비밀번호를 잊으셨나요?
            </button>
            <Button
              frame="cta"
              tone="login"
              type="submit"
              disabled={resolveEmailMutation.isPending}
            >
              이메일로 시작하기
            </Button>
            <Button
              frame="button"
              tone="social"
              type="button"
              disabled={
                resolveEmailMutation.isPending || googleAuthMutation.isPending || !isGoogleReady
              }
              leftIcon={<GoogleLogo alt="" />}
              onClick={promptGoogleIdentity}
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
          {...register('email')}
        />
      </AuthForm>
      <Modal.Root
        open={googleLinkRequest !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            dismissGoogleLink();
          }
        }}
      >
        <TextModal
          className="gap-024 px-030 pb-024 pt-030 items-center"
          title={
            <span className="flex flex-col items-center gap-[18px]">
              <span
                aria-hidden
                className="typo-heading-lg bg-surface-high text-text-lowest flex size-9 items-center justify-center rounded-full"
              >
                ?
              </span>
              <span>Google 계정을 연동할까요?</span>
            </span>
          }
          description={
            <>
              입력하신 이메일과 동일한 Google 계정이 있어요.
              <br />
              계정을 연동하고 간편하게 로그인해요.
              {googleLinkError ? (
                <span className="typo-body-lg text-sys-error-default mt-012 block" role="alert">
                  {googleLinkError}
                </span>
              ) : null}
            </>
          }
          actions={
            <>
              <Button
                frame="button"
                tone="stroke"
                className="h-12 flex-1"
                disabled={isGoogleLinkPending}
                onClick={deferGoogleLink}
              >
                나중에 하기
              </Button>
              <Button
                frame="button"
                tone="secondary"
                size="m"
                className="h-12 flex-1"
                disabled={isGoogleLinkPending}
                onClick={() => void confirmGoogleLink()}
              >
                연동하기
              </Button>
            </>
          }
        />
      </Modal.Root>
    </>
  );
}
