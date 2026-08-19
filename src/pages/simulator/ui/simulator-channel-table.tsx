import type { JSX } from 'react';
import { Check, X } from 'lucide-react';

import {
  formatSimulatorBudget,
  formatSimulatorCpc,
  formatSimulatorTableCountRange,
  type ChannelResult,
} from '@/pages/simulator/model/simulator-channel';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

function ExecutionStatus({ unavailable }: { unavailable?: boolean }): JSX.Element {
  if (unavailable === undefined) {
    return (
      <Text as="span" variant="body-xs" className="text-text-low">
        -
      </Text>
    );
  }

  const isExecutable = !unavailable;

  return (
    <Box
      as="span"
      className={`${
        isExecutable
          ? 'bg-sys-success-high text-sys-success-default'
          : 'bg-sys-error-low text-sys-error-default'
      } gap-002 px-006 py-004 h-020 flex items-center justify-center rounded-[var(--radius-xxs)]`}
    >
      {isExecutable ? (
        <Check aria-hidden className="size-012" strokeWidth={2.4} />
      ) : (
        <X aria-hidden className="size-012" strokeWidth={2.4} />
      )}
      <Text as="span" variant="caption-md">
        {isExecutable ? '운영 가능' : '예산 미달'}
      </Text>
    </Box>
  );
}

const TABLE_COLUMNS = [
  { key: 'channel', label: '채널' },
  { key: 'budget', label: '예산' },
  { key: 'cpc', label: '클릭당 비용' },
  { key: 'clicks', label: '예상 클릭 수' },
  { key: 'impressions', label: '예상 노출 수' },
  { key: 'status', label: '운영 가능 여부' },
] as const;

export function SimulatorChannelTable({
  channels,
}: {
  channels: readonly ChannelResult[];
}): JSX.Element {
  return (
    <Box className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] table-fixed border-collapse">
        <caption className="sr-only">채널별 예상 성과</caption>
        <colgroup>
          <col className="w-[150px]" />
          {TABLE_COLUMNS.slice(1).map((column) => (
            <col key={column.key} />
          ))}
        </colgroup>
        <thead className="bg-surface-low border-outline-low border-y">
          <tr className="h-040">
            {TABLE_COLUMNS.map((column) => (
              <Text
                as="th"
                key={column.key}
                scope="col"
                variant="caption-lg"
                className="text-text-low px-014 py-008 text-center font-medium"
              >
                {column.label}
              </Text>
            ))}
          </tr>
        </thead>
        <tbody>
          {channels.map((channel) => (
            <tr
              key={channel.channelId ?? channel.name}
              className="border-outline-low h-040 border-b last:border-b-0"
            >
              <Text
                as="th"
                scope="row"
                variant="body-xl"
                className={`${channel.unavailable ? 'text-text-low' : 'text-text-highest'} px-014 py-008 text-left whitespace-nowrap`}
              >
                {channel.name}
              </Text>
              <Text
                as="td"
                variant="body-xs"
                className={`${channel.unavailable ? 'text-text-low' : 'text-text-highest'} px-014 py-008 text-center whitespace-nowrap`}
              >
                {formatSimulatorBudget(channel.budgetWon)}
              </Text>
              <Text
                as="td"
                variant="body-xs"
                className={`${channel.unavailable ? 'text-text-low' : 'text-text-highest'} px-014 py-008 text-center whitespace-nowrap`}
              >
                {formatSimulatorCpc(channel.cpcWon)}
              </Text>
              <Text
                as="td"
                variant="body-xs"
                className={`${channel.unavailable ? 'text-text-low' : 'text-text-highest'} px-014 py-008 text-center whitespace-nowrap`}
              >
                {formatSimulatorTableCountRange(channel.clicks.range)}
              </Text>
              <Text
                as="td"
                variant="body-xs"
                className={`${channel.unavailable ? 'text-text-low' : 'text-text-highest'} px-014 py-008 text-center whitespace-nowrap`}
              >
                {formatSimulatorTableCountRange(channel.impressions.range)}
              </Text>
              <td className="px-014 py-008 text-center align-middle">
                <ExecutionStatus unavailable={channel.unavailable} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
