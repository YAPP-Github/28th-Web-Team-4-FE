'use client';

import type { JSX } from 'react';
import Image from 'next/image';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text, type TextVariant } from '@/shared/ui/text';

const AUDIENCE_ICON_ASSET_PATH = '/channel-detail-assets/audience-icons';

type AudienceIconVariant =
  | 'age'
  | 'genderMale'
  | 'genderFemale'
  | 'genderAll'
  | 'users'
  | 'dau'
  | 'traits';

const AUDIENCE_ICON_FILENAME_MAP = {
  age: 'age.svg',
  genderMale: 'gender-male.svg',
  genderFemale: 'gender-female.svg',
  genderAll: 'gender-all.svg',
  users: 'users.svg',
  dau: 'dau.svg',
  traits: 'traits.svg',
} as const satisfies Record<AudienceIconVariant, string>;

function getPrimaryGenderIconVariant(primaryGender: string): AudienceIconVariant {
  switch (primaryGender) {
    case '남성':
      return 'genderMale';
    case '여성':
      return 'genderFemale';
    default:
      return 'genderAll';
  }
}

function AudienceIcon({ variant }: { variant: AudienceIconVariant }): JSX.Element {
  return (
    <Box
      aria-hidden="true"
      className="flex size-[18px] shrink-0 items-center justify-center overflow-clip"
    >
      <Image
        src={`${AUDIENCE_ICON_ASSET_PATH}/${AUDIENCE_ICON_FILENAME_MAP[variant]}`}
        alt=""
        aria-hidden="true"
        width={18}
        height={18}
        unoptimized
        className="block size-[18px] shrink-0"
      />
    </Box>
  );
}

function AudienceMetricCard({
  label,
  value,
  icon,
  className,
  valueVariant = 'display-lg',
}: {
  label: string;
  value: string;
  icon: AudienceIconVariant;
  className?: string;
  valueVariant?: TextVariant;
}): JSX.Element {
  return (
    <Stack
      className={cn(
        'bg-surface-lower h-[96px] justify-between rounded-[var(--radius-m)] px-020 py-020',
        className,
      )}
    >
      <Box className="gap-004 flex items-center">
        <AudienceIcon variant={icon} />
        <Text as="dt" variant="subtitle-sm" className="text-text-low m-0">
          {label}
        </Text>
      </Box>
      <Text as="dd" variant={valueVariant} className="text-text-highest m-0 self-end text-right">
        {value}
      </Text>
    </Stack>
  );
}

export type ChannelDetailAudiencePanelProps = {
  channel: ChannelDetail;
};

export function ChannelDetailAudiencePanel({
  channel,
}: ChannelDetailAudiencePanelProps): JSX.Element {
  const { audience } = channel;

  return (
    <Box as="dl" className="gap-010 m-0 grid w-full grid-cols-2">
      <AudienceMetricCard icon="age" label="주요 연령대" value={audience.primaryAgeBand} />
      <AudienceMetricCard
        icon={getPrimaryGenderIconVariant(audience.primaryGender)}
        label="주요 성별"
        value={audience.primaryGender}
      />
      <AudienceMetricCard icon="users" label="사용자 규모" value={audience.userScale} />
      <AudienceMetricCard icon="dau" label="하루 활성 사용자" value={audience.dailyActiveUsers} />
      <AudienceMetricCard
        icon="traits"
        label="유저 특성"
        value={audience.traits}
        valueVariant="heading-md"
        className="col-span-2"
      />
    </Box>
  );
}
