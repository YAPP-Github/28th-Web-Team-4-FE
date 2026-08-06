'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { getApiErrorMessage } from '@/shared/api/api-error';
import { linkGoogleAccount } from '@/pages/auth/auth-entry/api/link-google-account';
import { useGoogleAuth } from '@/pages/auth/auth-entry/model/use-google-auth';
import { markGoogleLinkFeedbackPending } from '@/shared/lib/auth/google-link-feedback';

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

export type GoogleLinkRequest = {
  email: string;
  idToken: string;
};

type UseGoogleAuthFlowOptions = {
  onDeferLink: (email: string) => void;
};

const getGoogleIdentity = () => (window as typeof window & { google?: GoogleIdentity }).google;

export function useGoogleAuthFlow({ onDeferLink }: UseGoogleAuthFlowOptions) {
  const router = useRouter();
  const googleAuthMutation = useGoogleAuth();
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [googleInitializationError, setGoogleInitializationError] = useState<string>();
  const [googleLinkRequest, setGoogleLinkRequest] = useState<GoogleLinkRequest>();
  const [googleLinkError, setGoogleLinkError] = useState<string>();
  const [isGoogleLinkPending, setIsGoogleLinkPending] = useState(false);

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
      router.replace('/');
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
    promptGoogleIdentity,
  };
}
