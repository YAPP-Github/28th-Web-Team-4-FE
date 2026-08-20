'use client';

import type { JSX } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

import type {
  CompareResultChannel,
  CompareResultChannelDetails,
} from '@/pages/compare/model/compare-result-channel';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { CompareResultChannelDetailValue } from './compare-result-channel-detail-value';

const DETAIL_ROWS = [
  {
    key: 'minimumBudget',
    label: '최소 광고비',
    description: '얼마부터 집행 가능한지',
  },
  {
    key: 'primaryAudience',
    label: '주요 오디언스',
    description: '어떤 사람들이 주 고객인지',
  },
  {
    key: 'adFormats',
    label: '광고 형태',
    description: '어떤 형태로 보여지는지',
  },
  {
    key: 'targetingMethods',
    label: '타기팅 방식',
    description: '어떤 조건으로 타깃을 정하는지',
  },
] as const satisfies readonly {
  key: keyof CompareResultChannelDetails;
  label: string;
  description: string;
}[];

type CompareResultChannelDetailsProps = {
  channels: readonly CompareResultChannel[];
};

export function CompareResultChannelDetailsTable({
  channels,
}: CompareResultChannelDetailsProps): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="compare-result-channel-details-title"
      className="bg-surface-lowest gap-024 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
    >
      <Text
        as="h2"
        id="compare-result-channel-details-title"
        variant="heading-lg"
        className="text-text-highest"
      >
        채널별 상세 정보
      </Text>

      <Box className="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain">
        <BaseTooltip.Provider delay={150} timeout={400}>
          <table className="w-full min-w-[552px] table-fixed border-collapse">
            <caption className="sr-only">선택한 채널의 상세 정보 비교</caption>
            <colgroup>
              <col className="w-[192px]" />
              {channels.map((channel) => (
                <col key={channel.id} />
              ))}
            </colgroup>
            <thead className="bg-surface-low border-outline-low border-y">
              <tr className="h-032">
                <th aria-label="비교 항목" />
                {channels.map((channel) => (
                  <Text
                    as="th"
                    key={channel.id}
                    scope="col"
                    variant="caption-lg"
                    className="text-text-low px-012 py-008 text-left"
                  >
                    {channel.name}
                  </Text>
                ))}
              </tr>
            </thead>
            <tbody>
              {DETAIL_ROWS.map((row) => (
                <tr key={row.key} className="border-outline-low border-b last:border-b-0">
                  <th scope="row" className="px-012 py-014 text-left align-top">
                    <Box className="gap-002 flex flex-col items-start whitespace-nowrap">
                      <Text as="span" variant="subtitle-lg" className="text-text-high">
                        {row.label}
                      </Text>
                      <Text as="span" variant="body-xs" className="text-text-low">
                        {row.description}
                      </Text>
                    </Box>
                  </th>
                  {channels.map((channel) => (
                    <Box
                      as="td"
                      key={channel.id}
                      className="px-012 py-014 min-h-[70px] max-w-0 min-w-0 overflow-hidden align-top"
                    >
                      <CompareResultChannelDetailValue>
                        {channel.details[row.key]}
                      </CompareResultChannelDetailValue>
                    </Box>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </BaseTooltip.Provider>
      </Box>
    </Box>
  );
}
