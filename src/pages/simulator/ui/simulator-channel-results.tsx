import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { AuthenticatedChannelResults } from './simulator-authenticated-results';
import { GuestChannelResults } from './simulator-guest-results';
import { SimulatorResultsViewToggle } from './simulator-channel-performance';

type SimulatorChannelResultsProps = {
  isLogin: boolean;
  isChannelSelectionComplete?: boolean;
};

export function SimulatorChannelResults({
  isLogin,
  isChannelSelectionComplete = false,
}: SimulatorChannelResultsProps): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="simulator-channel-results-title"
      className="bg-surface-lowest gap-026 px-030 py-024 relative flex w-full flex-col overflow-hidden rounded-[var(--radius-l)]"
    >
      <Box className="flex w-full items-center justify-between">
        <Box className="flex items-center">
          <Text
            as="h2"
            id="simulator-channel-results-title"
            variant="heading-lg"
            className="text-text-highest"
          >
            채널별 예상 노출 · 클릭 수
          </Text>
        </Box>
        <SimulatorResultsViewToggle />
      </Box>
      {isLogin ? (
        <AuthenticatedChannelResults isChannelSelectionComplete={isChannelSelectionComplete} />
      ) : (
        <GuestChannelResults />
      )}
    </Box>
  );
}
