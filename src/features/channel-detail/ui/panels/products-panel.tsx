'use client';

import type { JSX } from 'react';
import { Info } from 'lucide-react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

type ProductTableColumn = {
  key: keyof Omit<ChannelDetail['products'][number], 'id'>;
  label: string;
  showInfo: boolean;
};

const PRODUCT_TABLE_COLUMNS = [
  { key: 'name', label: '상품', showInfo: false },
  { key: 'budgetRange', label: '예산 범위', showInfo: false },
  { key: 'expectedImpressions', label: '예상 노출', showInfo: false },
  { key: 'expectedClicks', label: '예상 클릭', showInfo: true },
] as const satisfies readonly ProductTableColumn[];

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
              {PRODUCT_TABLE_COLUMNS.map((column) => (
                <th key={column.key} className="px-014 py-008">
                  <HStack className="gap-004 items-center">
                    <Text as="span" variant="caption-lg" className="text-text-medium">
                      {column.label}
                    </Text>
                    {column.showInfo ? (
                      <Info className="text-icon-medium size-014" aria-hidden />
                    ) : null}
                  </HStack>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channel.products.map((product) => (
              <tr key={product.id} className="border-outline-low border-b last:border-b-0">
                {PRODUCT_TABLE_COLUMNS.map((column) => (
                  <td key={column.key} className="px-014 py-008">
                    <Text as="span" variant="body-sm" className="text-text-default">
                      {product[column.key]}
                    </Text>
                  </td>
                ))}
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
