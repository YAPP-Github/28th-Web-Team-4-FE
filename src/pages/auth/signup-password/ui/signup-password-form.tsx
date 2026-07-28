'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import { Button } from '@/shared/ui/button';
import { FormPanelHeader } from '@/shared/ui/form-panel';
import { InputField, type InputFieldFeedback } from '@/shared/ui/input-field';
import { HStack } from '@/shared/ui/layout/h-stack';
import { VStack } from '@/shared/ui/layout/v-stack';
import { BrandSymbol } from '@/shared/ui/symbol';
import { signupPasswordSchema } from '@/pages/auth/signup-password/model/signup-password-schema';

const PASSWORD_GUIDE = '비밀번호는 8자 이상으로, 영어·숫자·특수문자를 포함해야 해요';

type PasswordField = 'password' | 'passwordConfirmation';
type PasswordFeedback = Partial<Record<PasswordField, InputFieldFeedback>>;

function getPasswordFeedback(password: string, passwordConfirmation: string): PasswordFeedback {
  const result = signupPasswordSchema.safeParse({ password, passwordConfirmation });

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<PasswordFeedback>((feedback, issue) => {
    const field = issue.path[0];

    if ((field === 'password' || field === 'passwordConfirmation') && !feedback[field]) {
      feedback[field] = { tone: 'error', message: issue.message };
    }

    return feedback;
  }, {});
}

export function SignupPasswordForm(): JSX.Element | null {
  const router = useRouter();
  const email = useSignupDraftStore((state) => state.email);
  const emailVerified = useSignupDraftStore((state) => state.emailVerified);
  const savedPassword = useSignupDraftStore((state) => state.password);
  const hasHydrated = useSignupDraftStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && (!email || !emailVerified)) {
      router.replace('/login');
    }
  }, [email, emailVerified, hasHydrated, router]);

  if (!hasHydrated || !email || !emailVerified) {
    return null;
  }

  return <HydratedSignupPasswordForm email={email} initialPassword={savedPassword} />;
}

function HydratedSignupPasswordForm({
  email,
  initialPassword,
}: {
  email: string;
  initialPassword: string;
}): JSX.Element {
  const router = useRouter();
  const setStoredPassword = useSignupDraftStore((state) => state.setPassword);
  const [password, setPassword] = useState(initialPassword);
  const [passwordConfirmation, setPasswordConfirmation] = useState(initialPassword);
  const [feedback, setFeedback] = useState<PasswordFeedback>({});
  const [touched, setTouched] = useState<Partial<Record<PasswordField, boolean>>>({});

  const validateField = (
    field: PasswordField,
    nextPassword = password,
    nextPasswordConfirmation = passwordConfirmation,
  ) => {
    const nextFeedback = getPasswordFeedback(nextPassword, nextPasswordConfirmation);
    setFeedback((current) => ({ ...current, [field]: nextFeedback[field] }));
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPassword = event.currentTarget.value;
    setPassword(nextPassword);

    if (touched.password || feedback.password) {
      validateField('password', nextPassword, passwordConfirmation);
    }

    if (touched.passwordConfirmation || feedback.passwordConfirmation) {
      validateField('passwordConfirmation', nextPassword, passwordConfirmation);
    }
  };

  const handlePasswordConfirmationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPasswordConfirmation = event.currentTarget.value;
    setPasswordConfirmation(nextPasswordConfirmation);

    if (touched.passwordConfirmation || feedback.passwordConfirmation) {
      validateField('passwordConfirmation', password, nextPasswordConfirmation);
    }
  };

  const handleBlur = (field: PasswordField) => {
    setTouched((current) => ({ ...current, [field]: true }));
    validateField(field);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = signupPasswordSchema.safeParse({ password, passwordConfirmation });

    if (!result.success) {
      setTouched({ password: true, passwordConfirmation: true });
      setFeedback(getPasswordFeedback(password, passwordConfirmation));
      return;
    }

    setStoredPassword(result.data.password);
    router.push('/signup/name');
  };

  const handlePrevious = () => {
    router.push(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <>
      <FormPanelHeader
        graphic={<BrandSymbol className="h-[29px] w-6" alt="" />}
        title="비밀번호 설정하기"
        titleId="signup-password-title"
      />

      <VStack as="form" className="gap-036 w-full items-stretch" noValidate onSubmit={handleSubmit}>
        <VStack className="gap-024 items-stretch">
          <VStack className="gap-004 items-stretch">
            <strong className="typo-heading-lg text-text-high break-all">{email}</strong>
            <p className="typo-subtitle-xxs text-text-default">
              로그인에 사용할 비밀번호를 설정해요
            </p>
          </VStack>

          <VStack className="gap-012 items-stretch">
            <InputField
              frame="password"
              name="password"
              autoComplete="new-password"
              aria-label="비밀번호"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              feedback={feedback.password ?? { tone: 'info', message: PASSWORD_GUIDE }}
            />
            <InputField
              frame="password"
              name="passwordConfirmation"
              autoComplete="new-password"
              aria-label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해 주세요"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
              onBlur={() => handleBlur('passwordConfirmation')}
              feedback={feedback.passwordConfirmation}
            />
          </VStack>
        </VStack>

        <HStack className="gap-012">
          <Button
            frame="cta"
            tone="secondary"
            size="m"
            type="button"
            className="flex-1"
            onClick={handlePrevious}
          >
            이전
          </Button>
          <Button frame="cta" tone="login" type="submit" className="flex-1">
            다음
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
