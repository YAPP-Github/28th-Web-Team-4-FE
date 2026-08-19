'use client';

import type { JSX } from 'react';
import { Check, Info, X } from 'lucide-react';

import type {
  ChannelDetail,
  ChannelProductRow,
} from '@/features/channel-detail/model/channel-detail';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

type ProductTableRow = Pick<
  ChannelProductRow,
  'name' | 'budgetRange' | 'expectedImpressions' | 'expectedClicks'
>;

type ProductTableColumnKey = keyof ProductTableRow | 'isExecutable';

type ProductTableColumn = {
  key: ProductTableColumnKey;
  label: string;
  showInfo: boolean;
  className: string;
};

const PRODUCT_TABLE_COLUMNS = [
  { key: 'name', label: '상품', showInfo: false, className: 'w-[180px]' },
  { key: 'budgetRange', label: '예산 범위', showInfo: false, className: 'w-[170px]' },
  { key: 'expectedImpressions', label: '예상 노출', showInfo: false, className: 'w-[170px]' },
  { key: 'expectedClicks', label: '예상 클릭', showInfo: true, className: 'w-[170px]' },
  { key: 'isExecutable', label: '집행 가능', showInfo: false, className: 'w-[90px]' },
] as const satisfies readonly ProductTableColumn[];

export type ChannelDetailProductsPanelProps = {
  channel: ChannelDetail;
};

function ProductExecutableValue({ value }: { value: boolean | null }): JSX.Element {
  if (value === null) {
    return (
      <Text as="span" variant="body-sm" className="text-text-low">
        -
      </Text>
    );
  }

  if (value) {
    return (
      <>
        <Check className="text-sys-success-default size-018" aria-hidden="true" />
        <span className="sr-only">집행 가능</span>
      </>
    );
  }

  return (
    <>
      <X className="text-icon-low size-018" aria-hidden="true" />
      <span className="sr-only">집행 불가</span>
    </>
  );
}

function ProductTableCell({
  product,
  column,
}: {
  product: ChannelProductRow;
  column: ProductTableColumn;
}): JSX.Element {
  if (column.key === 'isExecutable') {
    return (
      <HStack className="items-center justify-center">
        <ProductExecutableValue value={product.isExecutable} />
      </HStack>
    );
  }

  return (
    <Text as="span" variant="body-sm" className="text-text-default">
      {product[column.key]}
    </Text>
  );
}

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
        <table className="w-full min-w-[780px] table-fixed border-collapse text-left">
          <colgroup>
            {PRODUCT_TABLE_COLUMNS.map((column) => (
              <col key={column.key} className={column.className} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-surface-low border-outline-low border-b">
              {PRODUCT_TABLE_COLUMNS.map((column) => (
                <th key={column.key} className="px-014 py-008">
                  <HStack
                    className={
                      column.key === 'isExecutable'
                        ? 'gap-004 items-center justify-center'
                        : 'gap-004 items-center'
                    }
                  >
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
                    <ProductTableCell product={product} column={column} />
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
