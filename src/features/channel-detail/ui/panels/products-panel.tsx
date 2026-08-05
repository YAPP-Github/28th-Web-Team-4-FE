'use client';

import type { JSX } from 'react';
import { Check, Info, X as XIcon } from 'lucide-react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

const PRODUCT_TABLE_HEADERS = [
  '상품',
  '예산 범위',
  '예상 노출',
  '예상 클릭률(CTR)',
  '집행 가능',
] as const;

export type ChannelDetailProductsPanelProps = {
  channel: ChannelDetail;
};

export function ChannelDetailProductsPanel({
  channel,
}: ChannelDetailProductsPanelProps): JSX.Element {
  if (channel.products.length === 0) {
    return (
      <Text as="p" variant="body-xl" className="text-text-medium">
        등록된 광고 상품이 없습니다.
      </Text>
    );
  }

  return (
    <Stack className="gap-010 w-full items-stretch">
      <Box className="w-full overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="bg-surface-low border-outline-low border-b">
              {PRODUCT_TABLE_HEADERS.map((header) => (
                <th key={header} className="px-014 py-008">
                  <HStack className="gap-004 items-center">
                    <Text as="span" variant="caption-lg" className="text-text-medium">
                      {header}
                    </Text>
                    {header.startsWith('예상 클릭률') ? (
                      <Info className="text-icon-medium size-014" aria-hidden />
                    ) : null}
                  </HStack>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channel.products.map((product) => (
              <tr key={product.name} className="border-outline-low border-b last:border-b-0">
                <td className="px-014 py-008">
                  <Text as="span" variant="body-sm" className="text-text-default">
                    {product.name}
                  </Text>
                </td>
                <td className="px-014 py-008">
                  <Text as="span" variant="body-sm" className="text-text-default">
                    {product.budgetRange}
                  </Text>
                </td>
                <td className="px-014 py-008">
                  <Text as="span" variant="body-sm" className="text-text-default">
                    {product.expectedImpressions}
                  </Text>
                </td>
                <td className="px-014 py-008">
                  <Text as="span" variant="body-sm" className="text-text-default">
                    {product.ctr ?? '-'}
                  </Text>
                </td>
                <td className="px-014 py-008">
                  {product.available ? (
                    <Check className="text-sys-success-default size-020" aria-label="집행 가능" />
                  ) : (
                    <XIcon className="text-icon-medium size-020" aria-label="집행 불가" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <HStack className="gap-006 items-start">
        <Info className="text-icon-medium mt-002 size-014 shrink-0" aria-hidden />
        <Text as="p" variant="subtitle-xxs" className="text-text-low">
          {channel.productsNote}
        </Text>
      </HStack>
    </Stack>
  );
}
