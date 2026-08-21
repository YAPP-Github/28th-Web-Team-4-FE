'use client';

/** Context 공통 속성과 renderless interaction 컴포넌트를 제공하는 React 분석 계층. */

import {
  cloneElement,
  createContext,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  use,
} from 'react';

import {
  type AnalyticsEventKey,
  type AnalyticsEventProperties,
  type AnalyticsScopeProperties,
} from './events';
import { trackClientEvent } from './track-client';

/** Scope Provider와 소비자가 공유하는 공통 분석 속성 객체. */
type AnalyticsScopeContextValue = AnalyticsScopeProperties;

const AnalyticsScopeContext = createContext<AnalyticsScopeContextValue | null>(null);

/** Analytics.Scope에 필요한 명시적 공통 흐름 속성. */
export type AnalyticsScopeProps = {
  entryPoint: AnalyticsScopeProperties['entry_point'];
  isLoggedIn: boolean;
  children: ReactNode;
};

/**
 * 하위 interaction 이벤트에 진입점과 로그인 여부를 제공한다.
 *
 * @param props 공통 분석 속성과 하위 React 트리
 * @returns 공통 분석 Context provider
 */
export function AnalyticsScope({ entryPoint, isLoggedIn, children }: AnalyticsScopeProps) {
  return (
    <AnalyticsScopeContext value={{ entry_point: entryPoint, is_logged_in: isLoggedIn }}>
      {children}
    </AnalyticsScopeContext>
  );
}

function useAnalyticsScope(): AnalyticsScopeContextValue {
  const contextValue = use(AnalyticsScopeContext);

  if (!contextValue) {
    throw new Error('Analytics.Click must be rendered inside Analytics.Scope.');
  }

  return contextValue;
}

/** Analytics.Click이 기존 클릭 handler를 합성할 수 있는 단일 자식의 최소 props. */
type ClickableChildProps = {
  onClick?: MouseEventHandler<HTMLElement>;
};

/** 이벤트 속성 중 Scope가 자동으로 제공하는 공통 속성을 제외한 호출부 입력 타입. */
type AnalyticsClickEventProperties<EventKey extends AnalyticsEventKey> = Omit<
  AnalyticsEventProperties<EventKey>,
  keyof AnalyticsScopeProperties
>;

/** 변수 객체로 전달해도 선택한 이벤트 계약 밖의 속성을 거부하는 클릭 속성 타입. */
type ExactAnalyticsClickEventProperties<
  EventKey extends AnalyticsEventKey,
  Properties extends AnalyticsClickEventProperties<EventKey>,
> = Properties &
  Record<Exclude<keyof Properties, keyof AnalyticsClickEventProperties<EventKey>>, never>;

/** renderless 클릭 로깅 컴포넌트의 typed props. */
export type AnalyticsClickProps<
  EventKey extends AnalyticsEventKey,
  Properties extends AnalyticsClickEventProperties<EventKey>,
> = {
  event: EventKey;
  properties: ExactAnalyticsClickEventProperties<EventKey, Properties>;
  children: ReactElement<ClickableChildProps>;
};

/**
 * 자식의 DOM 구조를 바꾸지 않고 기존 onClick 뒤에 typed interaction 이벤트를 전송한다.
 * 클릭 자체가 의미 있는 이벤트에 사용하며 API 성공·실패는 성공·실패 callback에서 기록한다.
 *
 * @param props 이벤트 key, 명시적 이벤트 속성과 단일 clickable 자식
 * @returns onClick이 합성된 기존 자식 element
 */
export function AnalyticsClick<
  EventKey extends AnalyticsEventKey,
  Properties extends AnalyticsClickEventProperties<NoInfer<EventKey>>,
>({ event, properties, children }: AnalyticsClickProps<EventKey, Properties>) {
  const scopeProperties = useAnalyticsScope();

  const handleClick: MouseEventHandler<HTMLElement> = (clickEvent) => {
    children.props.onClick?.(clickEvent);

    trackClientEvent<EventKey, AnalyticsEventProperties<EventKey>>(event, {
      ...scopeProperties,
      ...properties,
    } as AnalyticsEventProperties<EventKey>);
  };

  return cloneElement(children, { onClick: handleClick });
}

/** 공통 Scope와 interaction 컴포넌트를 명시적으로 조합하는 compound API. */
export const Analytics = {
  Scope: AnalyticsScope,
  Click: AnalyticsClick,
} as const;
