import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Placement } from '@floating-ui/react-dom';
import { expect, within } from 'storybook/test';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Tooltip } from '@/shared/ui/tooltip';

const SAMPLE = '광고비 대비 매출을 뜻해요';

const TOOLTIP_PLACEMENTS = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
] as const satisfies readonly Placement[];

type TooltipStoryArgs = {
  placement: Placement;
  offset: number;
  showArrow: boolean;
  content: string;
  className?: string;
};

const meta = {
  title: 'components/Tooltip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '항상 렌더링되는 anchored tooltip입니다. Tooltip.Root가 Floating UI로 위치를 계산하고, Anchor가 기준 요소, Content가 말풍선을 렌더링합니다. 사용자는 `placement`와 `offset`만 조정하고, 화면 충돌 보정과 위치 갱신은 컴포넌트 내부 정책으로 처리합니다.',
      },
    },
  },
  args: {
    placement: 'top',
    offset: 8,
    showArrow: true,
    content: SAMPLE,
  },
  argTypes: {
    placement: {
      control: 'radio',
      options: TOOLTIP_PLACEMENTS,
      description:
        '말풍선의 선호 배치입니다. 공간이 부족하면 내부 보정 정책에 따라 반대 방향으로 바뀔 수 있습니다.',
      table: {
        category: 'Tooltip.Root',
        defaultValue: { summary: 'top' },
        type: { summary: 'Placement' },
      },
    },
    offset: {
      control: { type: 'number', step: 1 },
      description:
        'Anchor와 Content 사이의 거리입니다. 숫자는 px 단위로 해석되며, 음수면 anchor 쪽으로 가까워지거나 겹칠 수 있습니다. 기본값은 Figma 화살표 간격에 맞춘 8입니다.',
      table: {
        category: 'Tooltip.Root',
        defaultValue: { summary: '8' },
        type: { summary: 'number | OffsetOptions' },
      },
    },
    showArrow: {
      control: 'boolean',
      description:
        '말풍선 꼬리 표시 여부입니다. 꼬리는 lucide 아이콘이 아니라 배경과 이어지는 DOM 요소입니다.',
      table: {
        category: 'Tooltip.Content',
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
      },
    },
    content: {
      control: 'text',
      description:
        '말풍선에 표시할 설명 텍스트입니다. 짧은 광고 용어 설명을 기준으로 설계했습니다.',
      table: {
        category: 'Tooltip.Content',
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Content에 추가할 className입니다. 기본 토큰 스타일 뒤에 병합됩니다.',
      table: {
        category: 'Tooltip.Content',
        type: { summary: 'string' },
      },
    },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-background-default flex min-h-[320px] w-full items-center justify-center p-10">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<TooltipStoryArgs>;

export default meta;
type Story = StoryObj<TooltipStoryArgs>;

const renderTooltip = (args: TooltipStoryArgs, label: string) => (
  <Tooltip.Root placement={args.placement} offset={args.offset}>
    <Tooltip.Anchor>
      <Button frame="button" tone="stroke">
        {label}
      </Button>
    </Tooltip.Anchor>
    <Tooltip.Content className={args.className} showArrow={args.showArrow}>
      {args.content}
    </Tooltip.Content>
  </Tooltip.Root>
);

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '`placement`, `offset`, `showArrow`를 Controls에서 바꿔가며 기본 동작을 확인합니다.',
      },
    },
  },
  render: (args) => renderTooltip(args, 'ROAS'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('ROAS')).toBeVisible();
    await expect(canvas.getByText(SAMPLE)).toBeVisible();
  },
};

export const AllPlacements: Story = {
  argTypes: {
    placement: { control: false },
    offset: { control: false },
    showArrow: { control: false },
    content: { control: false },
    className: { control: false },
  },
  render: () => (
    <Box className="grid w-full max-w-[560px] grid-cols-2 gap-x-20 gap-y-24">
      {TOOLTIP_PLACEMENTS.map((placement) => (
        <Box key={placement} className="flex min-h-28 items-center justify-center">
          <Tooltip.Root placement={placement}>
            <Tooltip.Anchor>
              <Button frame="button" tone="stroke">
                {placement}
              </Button>
            </Tooltip.Anchor>
            <Tooltip.Content>{SAMPLE}</Tooltip.Content>
          </Tooltip.Root>
        </Box>
      ))}
    </Box>
  ),
};

export const PositioningOptions: Story = {
  args: {
    placement: 'bottom',
    offset: 16,
    showArrow: true,
    content: 'offset을 키우면 기준 요소와 말풍선 사이 간격이 넓어져요',
  },
  parameters: {
    docs: {
      description: {
        story:
          '위치 관련 props를 문서에서 비교하기 위한 예시입니다. `offset`은 기준 요소와 말풍선 사이 간격을 담당합니다. 화면 밖 이탈 보정은 내부에서 항상 처리합니다.',
      },
    },
  },
  render: (args) => renderTooltip(args, '옵션'),
};

export const LongText: Story = {
  args: {
    placement: 'top',
    content: '광고를 본 사용자가 실제 구매나 신청까지 이어진 비율을 뜻해요',
  },
  render: (args) => renderTooltip(args, 'CVR'),
};

export const CustomClassName: Story = {
  args: {
    placement: 'bottom',
    content: SAMPLE,
    className: 'opacity-80',
  },
  render: (args) => renderTooltip(args, 'CTR'),
};

export const EdgeCollision: Story = {
  argTypes: {
    placement: { control: false },
    offset: { control: false },
    showArrow: { control: false },
    content: { control: false },
    className: { control: false },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-background-default flex min-h-[320px] w-full items-start justify-start p-4">
        <Story />
      </Box>
    ),
  ],
  render: () => (
    <Tooltip.Root placement="left">
      <Tooltip.Anchor>
        <Button frame="button" tone="stroke">
          가장자리
        </Button>
      </Tooltip.Anchor>
      <Tooltip.Content>공간이 부족하면 자동으로 위치를 조정해요</Tooltip.Content>
    </Tooltip.Root>
  ),
};
