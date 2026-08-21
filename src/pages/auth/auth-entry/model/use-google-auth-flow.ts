'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { getApiErrorMessage } from '@/shared/api/api-error';
import { linkGoogleAccount } from '@/pages/auth/auth-entry/api/link-google-account';
import { useGoogleAuth } from '@/pages/auth/auth-entry/model/use-google-auth';
import { markGoogleLinkFeedbackPending } from '@/shared/lib/auth/google-link-feedback';

type GoogleCredentialResponse = { credential?: string };
type GoogleButtonConfiguration = {
  type: 'standard';
  theme: 'outline';
  size: 'large';
  text: 'continue_with';
  shape: 'rectangular';
  logo_alignment: 'center';
  width: string;
  locale: 'ko';
};
type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: {
        callback: (response: GoogleCredentialResponse) => void;
        client_id: string;
      }) => void;
      renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
    };
  };
};

export type GoogleLinkRequest = {
  email: string;
  idToken: string;
};

type UseGoogleAuthFlowOptions = {
  onDeferLink: (email: string) => void;
  returnTo?: string;
};

const getGoogleIdentity = () => (window as typeof window & { google?: GoogleIdentity }).google;

export function useGoogleAuthFlow({ onDeferLink, returnTo = '/' }: UseGoogleAuthFlowOptions) {
  const router = useRouter();
  const googleAuthMutation = useGoogleAuth({ returnTo });
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [googleInitializationError, setGoogleInitializationError] = useState<string>();
  const [googleLinkRequest, setGoogleLinkRequest] = useState<GoogleLinkRequest>();
  const [googleLinkError, setGoogleLinkError] = useState<string>();
  const [isGoogleLinkPending, setIsGoogleLinkPending] = useState(false);

  const initializeGoogleIdentity = (buttonContainer: HTMLElement | null) => {
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

    if (!buttonContainer) {
      setIsGoogleReady(false);
      setGoogleInitializationError('Google 로그인 버튼을 불러오지 못했습니다. 다시 시도해 주세요.');
      return;
    }

    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: ({ credential }) => {
        if (!credential) {
          return;
        }

        googleAuthMutation.mutate(credential, {
          onSuccess: (resolution) => {
            if (resolution.type === 'link') {
              setGoogleLinkError(undefined);
              setGoogleLinkRequest({ email: resolution.email, idToken: credential });
            }
          },
        });
      },
    });
    buttonContainer.replaceChildren();
    google.accounts.id.renderButton(buttonContainer, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'center',
      width: String(Math.min(400, Math.max(200, buttonContainer.clientWidth || 400))),
      locale: 'ko',
    });
    setGoogleInitializationError(undefined);
    setIsGoogleReady(true);
  };

  const deferGoogleLink = () => {
    if (!googleLinkRequest) {
      return;
    }

    onDeferLink(googleLinkRequest.email);
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
      router.replace(returnTo);
    } catch (error) {
      setGoogleLinkError(getApiErrorMessage(error, 'Google 계정을 연결하지 못했습니다.'));
      setIsGoogleLinkPending(false);
    }
  };

  return {
    confirmGoogleLink,
    deferGoogleLink,
    dismissGoogleLink,
    googleErrorMessage:
      googleInitializationError ??
      (googleAuthMutation.error
        ? getApiErrorMessage(googleAuthMutation.error, 'Google 인증 중 문제가 발생했습니다.')
        : undefined),
    googleLinkError,
    googleLinkRequest,
    initializeGoogleIdentity,
    isGoogleAuthPending: googleAuthMutation.isPending,
    isGoogleLinkPending,
    isGoogleReady,
  };
}
