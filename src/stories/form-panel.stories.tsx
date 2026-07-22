import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/shared/ui/button';
import { FormPanel, FormPanelHeader } from '@/shared/ui/form-panel';
import { Input } from '@/shared/ui/input';

const meta = {
  title: 'components/FormPanel',
  component: FormPanel,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-surface-lower flex min-h-[720px] items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-labelledby': 'form-panel-story-title',
    children: (
      <>
        <FormPanelHeader
          graphic={<span className="bg-sys-primary-default size-6 rounded-full" />}
          title="정보 입력"
          titleId="form-panel-story-title"
        />
        <form className="flex w-full flex-col gap-12">
          <Input aria-label="이메일" placeholder="이메일을 입력해 주세요" />
          <Button frame="cta" tone="login" type="submit">
            계속하기
          </Button>
        </form>
      </>
    ),
  },
};
