/* oxlint-disable import/no-relative-parent-imports */

import { describe, expect, it } from 'vitest';

import { analyzeSource, parseArguments } from '../scripts/check-layout-usage.mjs';

describe('check-layout-usage', () => {
  it('finds Box and native flex/grid layout candidates', () => {
    const findings = analyzeSource(`
      import { Box as LayoutBox } from '@/shared/ui/layout/box';

      export function Example() {
        return (
          <main className="grid grid-cols-2">
            <LayoutBox className={condition ? 'sm:flex' : 'relative'} />
          </main>
        );
      }
    `);

    expect(findings.map(({ rule, component, classes }) => ({ rule, component, classes }))).toEqual([
      { rule: 'native-layout', component: 'main', classes: ['grid'] },
      { rule: 'box-layout', component: 'Box', classes: ['sm:flex'] },
    ]);
  });

  it('finds redundant and conflicting Layout invariant classes including variants', () => {
    const findings = analyzeSource(`
      import { HStack as Row } from '@/shared/ui/layout/h-stack';
      import { Grid } from '@/shared/ui/layout/grid';

      export function Example() {
        return (
          <>
            <Row className="items-center md:items-start" />
            <Grid className="grid grid-cols-2" />
          </>
        );
      }
    `);

    expect(
      findings.map(({ rule, component, classes, message }) => ({
        rule,
        component,
        classes,
        message,
      })),
    ).toEqual([
      {
        rule: 'layout-invariant',
        component: 'HStack',
        classes: ['items-center', 'md:items-start'],
        message: 'HStack의 불변 속성과 충돌합니다. 다른 Layout을 선택하세요.',
      },
      {
        rule: 'layout-invariant',
        component: 'Grid',
        classes: ['grid'],
        message: 'Grid 호출부에서 이미 제공되는 불변 클래스를 제거하세요.',
      },
    ]);
  });

  it('allows responsive direction changes on Flex and ignores unrelated components', () => {
    const findings = analyzeSource(`
      import { Flex } from '@/shared/ui/layout/flex';
      import { Box } from '@/other/box';

      export function Example() {
        return (
          <>
            <Flex className="flex-col md:flex-row" />
            <Box className="flex" />
          </>
        );
      }
    `);

    expect(findings).toEqual([]);
  });

  it('finds deprecated Spacing imports', () => {
    const findings = analyzeSource(`
      import { Spacing as Space } from '@/shared/ui/layout/spacing';
      export const Example = () => <Space />;
    `);

    expect(findings).toMatchObject([
      {
        rule: 'no-spacing',
        component: 'Spacing',
      },
    ]);
  });

  it('parses report modes and rejects unknown options', () => {
    expect(parseArguments(['--changed', '--strict'])).toEqual({
      changed: true,
      strict: true,
      help: false,
    });
    expect(() => parseArguments(['--fix'])).toThrow('알 수 없는 옵션: --fix');
  });
});
