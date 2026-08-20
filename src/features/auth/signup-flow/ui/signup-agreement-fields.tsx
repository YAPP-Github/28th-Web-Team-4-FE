import type { JSX } from 'react';

import { Checkbox } from '@/shared/ui/checkbox';
import { HStack } from '@/shared/ui/layout/h-stack';
import { VStack } from '@/shared/ui/layout/v-stack';

export type SignupAgreements = {
  serviceTermsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
};

type Agreement = keyof SignupAgreements;

type SignupAgreementFieldsProps = {
  agreements: SignupAgreements;
  idPrefix?: string;
  onAgreementsChange: (agreements: SignupAgreements) => void;
  onViewAgreement?: (agreement: Agreement) => void;
};

const AGREEMENT_ITEMS = [
  {
    agreement: 'serviceTermsAgreed',
    label: '서비스 이용약관 동의',
    qualifier: '필수',
    href: 'https://extreme-moonstone-8ae.notion.site/3b2b0b17e916806c92cdec7eac6c0f7c',
  },
  {
    agreement: 'privacyAgreed',
    label: '개인정보 수집·이용 동의',
    qualifier: '필수',
    href: 'https://app.notion.com/p/3b2b0b17e91680dc9567c8db372aa63d?source=copy_link',
  },
  {
    agreement: 'marketingAgreed',
    label: '마케팅 정보 수신 동의',
    qualifier: '선택',
    href: 'https://app.notion.com/p/3b2b0b17e91680dc9567c8db372aa63d?source=copy_link',
  },
] as const;

export function SignupAgreementFields({
  agreements,
  idPrefix = 'signup',
  onAgreementsChange,
  onViewAgreement,
}: SignupAgreementFieldsProps): JSX.Element {
  const allAgreed = Object.values(agreements).every(Boolean);

  const handleAllAgreementsChange = (checked: boolean) => {
    onAgreementsChange({
      serviceTermsAgreed: checked,
      privacyAgreed: checked,
      marketingAgreed: checked,
    });
  };

  const updateAgreement = (agreement: Agreement, checked: boolean) => {
    onAgreementsChange({ ...agreements, [agreement]: checked });
  };

  return (
    <VStack className="gap-020 items-stretch">
      <HStack className="gap-010">
        <Checkbox
          id={`${idPrefix}-all-agreements`}
          size="m"
          checked={allAgreed}
          onCheckedChange={handleAllAgreementsChange}
        />
        <label
          className="typo-subtitle-xxl text-text-highest cursor-pointer"
          htmlFor={`${idPrefix}-all-agreements`}
        >
          전체 동의하기
        </label>
      </HStack>

      <div className="border-outline-low border-t" />

      <VStack className="gap-014 items-stretch">
        {AGREEMENT_ITEMS.map(({ agreement, label, qualifier, href }) => {
          const id = `${idPrefix}-${agreement}`;

          return (
            <HStack className="gap-010" key={agreement}>
              <Checkbox
                id={id}
                size="m"
                checked={agreements[agreement]}
                onCheckedChange={(checked) => updateAgreement(agreement, checked)}
              />
              <label
                className="gap-004 flex min-w-0 flex-1 cursor-pointer items-center whitespace-nowrap"
                htmlFor={id}
              >
                <span className="typo-subtitle-xxl text-text-high">{label}</span>
                <span className="typo-subtitle-xxs text-text-medium">({qualifier})</span>
              </label>
              {href ? (
                <a
                  className="typo-body-xl text-text-low focus-visible:outline-sys-primary-default rounded-xxs shrink-0 underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  보기
                </a>
              ) : (
                <button
                  className="typo-body-xl text-text-low focus-visible:outline-sys-primary-default rounded-xxs shrink-0 underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                  type="button"
                  onClick={() => onViewAgreement?.(agreement)}
                >
                  보기
                </button>
              )}
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}
