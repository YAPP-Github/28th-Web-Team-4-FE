'use client';

import { useEffect } from 'react';

import { consumeGoogleLinkFeedback } from '@/shared/lib/auth/google-link-feedback';
import { showToast } from '@/shared/ui/toast';

export function GoogleLinkSuccessToast() {
  useEffect(() => {
    if (consumeGoogleLinkFeedback()) {
      showToast({
        id: 'google-account-linked',
        description: '기존 이메일 계정과 Google 계정이 연결되었어요.',
      });
    }
  }, []);

  return null;
}
