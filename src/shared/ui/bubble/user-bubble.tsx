import type { JSX, ReactNode } from 'react';

import { VStack } from '@/shared/ui/layout/v-stack';
import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';

import { BubbleShell } from './bubble-shell';

const DEFAULT_EDIT_LABEL = '수정';

/**
 * user frame 수정 버튼 기본 노출 여부.
 * 생략 시 수정 UI는 숨기고, `canEdit: true`일 때만 `onEdit`가 필수다.
 */
export const DEFAULT_CAN_EDIT = false as const;

type UserBubbleBaseProps = {
  children: ReactNode;
  className?: string;
  editLabel?: string;
};

export type UserBubbleProps = UserBubbleBaseProps &
  (
    | {
        /** 생략 시 {@link DEFAULT_CAN_EDIT}. `false`이면 `onEdit`는 선택이다. */
        canEdit?: false;
        onEdit?: () => void;
      }
    | {
        /** `true`일 때 수정 버튼을 렌더하고 `onEdit`가 필수다. */
        canEdit: true;
        onEdit: () => void;
      }
  );

export const UserBubble = (props: UserBubbleProps): JSX.Element => {
  const { children, className, editLabel = DEFAULT_EDIT_LABEL } = props;
  const canEdit = props.canEdit ?? DEFAULT_CAN_EDIT;

  return (
    <VStack className={cn('gap-006', className)}>
      <BubbleShell frame="user">{children}</BubbleShell>
      {canEdit && (
        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={props.onEdit}
            className="group underline decoration-from-font outline-none"
          >
            <Text
              variant="subtitle-xxs"
              className="text-text-medium group-focus-visible:text-text-highest"
            >
              {editLabel}
            </Text>
          </button>
        </div>
      )}
    </VStack>
  );
};
