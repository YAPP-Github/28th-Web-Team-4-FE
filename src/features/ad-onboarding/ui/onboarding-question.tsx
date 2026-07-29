/**
 * 광고 온보딩 질문 제목·설명·입력 컨트롤을 bot Bubble 안에 조합한다.
 */

import type { JSX, ReactNode } from 'react';

import { Bubble } from '@/shared/ui/bubble';
import { cn } from '@/shared/ui/cn';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';

export type OnboardingQuestionProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function OnboardingQuestion({
  title,
  description,
  children,
  className,
  contentClassName,
}: OnboardingQuestionProps): JSX.Element {
  return (
    <Bubble
      frame="bot"
      className={cn(
        [
          'w-full max-w-[510px] px-030 py-022',
          'rounded-bl-[var(--radius-l)] rounded-br-[var(--radius-l)]',
          'rounded-tr-[var(--radius-l)]',
        ],
        className,
      )}
    >
      <VStack className={cn('gap-020 items-start', contentClassName)}>
        <VStack className="gap-002 items-start">
          <Text as="h2" variant="heading-lg" className="text-text-highest">
            {title}
          </Text>
          {description ? (
            <Text variant="body-xl" className="text-text-low">
              {description}
            </Text>
          ) : null}
        </VStack>
        {children}
      </VStack>
    </Bubble>
  );
}
