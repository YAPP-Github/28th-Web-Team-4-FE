import { Text } from '@/shared/ui/text';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';

type FooterProps = {
  title: string;
  descriptionLines: readonly string[];
};

export function Footer({ title, descriptionLines }: FooterProps) {
  return (
    <HStack as="footer" className="bg-surface-lower w-full justify-center px-120 py-[50px]">
      <Stack className="gap-012 w-full max-w-[1200px] items-start">
        <Text as="strong" variant="heading-xl" className="text-text-default">
          {title}
        </Text>
        <Stack>
          {descriptionLines.map((descriptionLine, index) => (
            <Text
              key={`${descriptionLine}-${index}`}
              as="p"
              variant="subtitle-xxs"
              className="text-text-low"
            >
              {descriptionLine}
            </Text>
          ))}
        </Stack>
      </Stack>
    </HStack>
  );
}
