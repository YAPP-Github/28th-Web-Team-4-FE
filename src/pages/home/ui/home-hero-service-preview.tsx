'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import Image from 'next/image';
import { Download, Info, SlidersHorizontal } from 'lucide-react';

import { AvatarPlaceholder } from '@/shared/ui/avatar/avatar-placeholder';
import { HERO_RESULT_CHANNELS, HERO_TOTAL_SUMMARY } from '@/pages/home/model/home-hero-content';

const MOCK_NAV_ITEMS = [
  { label: '맞춤 채널 추천', isActive: false },
  { label: '전체 채널 비교', isActive: false },
  { label: '예산 시뮬레이터', isActive: true },
  { label: '마이페이지', isActive: false },
];

function MockChannelBar({
  value,
  fillPercentage,
  fillColor,
  textColor,
  isDimmed = false,
}: {
  value: string;
  fillPercentage: number;
  fillColor: string;
  textColor: string;
  isDimmed?: boolean;
}): JSX.Element {
  return (
    <div className="flex w-full items-center gap-[11.4px]">
      <div className="bg-surface-default h-[7.5px] w-full min-w-0 flex-1 overflow-hidden rounded-full">
        <div
          style={{
            width: `${fillPercentage}%`,
            backgroundColor: isDimmed ? 'transparent' : fillColor,
          }}
          className="h-full rounded-full"
        />
      </div>
      <span
        style={{
          color: isDimmed ? 'var(--color-text-low, #A2A2A8)' : textColor,
          fontSize: '9.75px',
          fontWeight: 700,
          lineHeight: '14.625px',
          letterSpacing: '-0.406px',
        }}
        className="w-[90px] shrink-0 text-left font-bold"
      >
        {value}
      </span>
    </div>
  );
}

// Figma (node 3766:110432) "예산 시뮬레이션_결과" (디자인 토큰 매핑 완료)
export function HomeHeroServicePreview(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Figma 원본 전체 외부 박스 크기: 1170px x 790px
  const TOTAL_WIDTH = 1170;
  const TOTAL_HEIGHT = 790;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const updateScale = () => {
      const containerWidth = el.offsetWidth;
      if (containerWidth > 0) {
        setScale(Math.min(1, containerWidth / TOTAL_WIDTH));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, [TOTAL_WIDTH]);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full justify-center overflow-visible"
      style={{ height: TOTAL_HEIGHT * scale }}
    >
      <div
        style={{
          width: TOTAL_WIDTH,
          height: TOTAL_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
        role="img"
        aria-label="채소ZIP 예산 시뮬레이터 결과 화면 미리보기"
        className="bg-surface-default shadow-drop-shadow-01 pointer-events-none relative shrink-0 rounded-[51.5px] p-[23.4px] select-none"
      >
        {/* 내부 콘텐츠 컨테이너 (Figma: cornerRadius 28.1px, size: 1123.2px x 743.2px) */}
        <div className="bg-surface-low flex size-full flex-col overflow-hidden rounded-[28.1px]">
          {/* 1. 메인 헤더 (Figma node 3766:110433 | h: 58.5px, px: 97.5px, 로고 옆 메뉴 탭 좌측 정렬) */}
          <div className="border-outline-lower bg-surface-lowest flex h-[58.5px] shrink-0 items-center justify-between border-b px-[97.5px]">
            {/* 좌측 그룹: 로고 + 네비게이션 탭 (gap: 43.9px) */}
            <div className="flex items-center gap-[43.9px]">
              <span className="text-sys-primary-default font-wanted shrink-0 text-[16px] font-bold tracking-tight">
                Chaeso.zip
              </span>

              <div className="flex items-center gap-[21.1px]">
                {MOCK_NAV_ITEMS.map((item) => (
                  <span
                    key={item.label}
                    style={{
                      color: item.isActive
                        ? 'var(--color-text-highest, #2E2E33)'
                        : 'var(--color-text-low, #A2A2A8)',
                      fontSize: '11.375px',
                      fontWeight: 700,
                    }}
                    className="px-[9.75px] py-[6.5px]"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* 우측 그룹: 프로필 (실제 헤더의 AvatarPlaceholder와 동일) */}
            <div className="flex shrink-0 items-center gap-[14.6px]">
              <span
                style={{
                  color: 'var(--color-text-medium, #6E6E76)',
                  fontSize: '11.375px',
                  fontWeight: 600,
                }}
              >
                채소집 님
              </span>
              <div className="size-[29.25px] shrink-0 overflow-hidden rounded-full">
                <AvatarPlaceholder className="size-full" />
              </div>
            </div>
          </div>

          {/* 2. 서브 헤더 (Figma node 3766:110434 | h: 58.5px, px: 97.5px) */}
          <div className="border-outline-lower bg-surface-lowest flex h-[58.5px] shrink-0 items-center justify-between border-b px-[97.5px]">
            <span className="text-text-highest text-[14.6px] font-bold">
              설정한 예산으로 얻을 수 있는 예상 성과예요
            </span>

            {/* 우측 결과 저장 버튼 (Figma: h: 35.8px, px: 13px, rounded: 6px) */}
            <div className="border-outline-low text-text-high bg-surface-lowest flex h-[35.8px] shrink-0 items-center gap-[6.5px] rounded-[6px] border px-[13px] shadow-2xs">
              <Download aria-hidden className="text-text-medium size-[13px]" />
              <span className="text-text-high text-[11.4px] font-semibold">결과 저장하기</span>
            </div>
          </div>

          {/* 3. 본문 영역 (Figma: Area padding [32.5px, 263.25px] -> 가운데 644px 카드 컨테이너) */}
          <div className="flex flex-1 flex-col items-center px-[263px] py-[32.5px]">
            <div className="flex w-[644px] flex-col gap-[16.2px]">
              {/* 카드 1: 총 예상 성과 (Figma node 3766:110437 | pad [19.5px, 24.4px], gap 14.6px, radius 13px) */}
              <div className="bg-surface-lowest flex flex-col gap-[14.6px] rounded-[13px] p-[24.4px] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <span className="text-text-highest text-[14.6px] leading-tight font-bold">
                  총 예상 성과
                </span>
                <div className="flex w-full items-center justify-between">
                  {/* 항목 1: 집행 가능 채널 */}
                  <div className="flex w-[178.75px] items-center justify-between">
                    <div className="flex flex-col items-start gap-[1.6px]">
                      <strong className="text-text-high text-[19.5px] leading-tight font-bold">
                        {HERO_TOTAL_SUMMARY.channelCount.value}
                      </strong>
                      <span className="text-text-low text-[11.4px] font-medium whitespace-nowrap">
                        {HERO_TOTAL_SUMMARY.channelCount.label}
                      </span>
                    </div>
                    <div className="flex size-[32.5px] shrink-0 items-center justify-center">
                      <Image
                        src="/simulator-assets/channels.svg"
                        alt=""
                        width={32.5}
                        height={30}
                        className="size-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="bg-surface-default h-[40.6px] w-[1px] shrink-0" />

                  {/* 항목 2: 예상 총 노출 */}
                  <div className="flex w-[178.75px] items-center justify-between">
                    <div className="flex flex-col items-start gap-[1.6px]">
                      <strong className="text-text-high text-[19.5px] leading-tight font-bold">
                        {HERO_TOTAL_SUMMARY.impressions.value}
                      </strong>
                      <span className="text-text-low text-[11.4px] font-medium whitespace-nowrap">
                        {HERO_TOTAL_SUMMARY.impressions.label}
                      </span>
                    </div>
                    <div className="flex size-[32.5px] shrink-0 items-center justify-center">
                      <Image
                        src="/simulator-assets/impressions.svg"
                        alt=""
                        width={32.5}
                        height={32.5}
                        className="size-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="bg-surface-default h-[40.6px] w-[1px] shrink-0" />

                  {/* 항목 3: 예상 총 클릭 */}
                  <div className="flex w-[178.75px] items-center justify-between">
                    <div className="flex flex-col items-start gap-[1.6px]">
                      <strong className="text-text-high text-[19.5px] leading-tight font-bold">
                        {HERO_TOTAL_SUMMARY.clicks.value}
                      </strong>
                      <span className="text-text-low text-[11.4px] font-medium whitespace-nowrap">
                        {HERO_TOTAL_SUMMARY.clicks.label}
                      </span>
                    </div>
                    <div className="flex size-[32.5px] shrink-0 items-center justify-center">
                      <Image
                        src="/simulator-assets/clicks.svg"
                        alt=""
                        width={32.5}
                        height={32.5}
                        className="size-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 카드 2: 채널별 예상 노출 · 클릭 수 (Figma node 3766:110457 | pad [19.5px, 24.4px], gap 21.1px, radius 13px) */}
              <div className="bg-surface-lowest flex flex-col gap-[21.1px] rounded-[13px] p-[24.4px] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[4.9px]">
                    <span className="text-text-highest text-[14.6px] leading-tight font-bold">
                      채널별 예상 노출 · 클릭 수
                    </span>
                    <Info aria-hidden className="text-icon-low size-[14px]" />
                  </div>
                  {/* 뷰 토글 미니 아이콘 버튼 (Figma node 3766:110462 / 3766:110464 스트로크 없는 사각형) */}
                  <div className="flex items-center gap-[1.6px]">
                    <div className="flex size-[21.1px] items-center justify-center rounded-[3px]">
                      <Image
                        src="/simulator-assets/graph.svg"
                        alt=""
                        width={10}
                        height={9}
                        className="size-[10px]"
                      />
                    </div>
                    {/* table 아이콘: 스트로크 없이 깔끔한 흰색 박스 */}
                    <div className="bg-surface-lowest flex size-[21.1px] items-center justify-center rounded-[3px] shadow-2xs">
                      <Image
                        src="/simulator-assets/table.svg"
                        alt=""
                        width={10}
                        height={10}
                        className="size-[10px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 채널 항목 리스트 (Figma node 3766:110467 / 3766:110469 | gap: 17.9px) */}
                <div className="flex flex-col gap-[17.9px]">
                  {HERO_RESULT_CHANNELS.map((channel) => (
                    <div key={channel.id} className="flex w-full items-start gap-[11.4px]">
                      <div
                        className={`border-outline-low bg-surface-lowest relative size-[29.25px] shrink-0 overflow-hidden rounded-[5px] border ${channel.isEstimated ? '' : 'opacity-40'}`}
                      >
                        <Image
                          src={channel.iconSrc}
                          alt=""
                          width={29.25}
                          height={29.25}
                          className="size-full object-contain"
                          loading="eager"
                          unoptimized
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col items-start gap-[4.9px]">
                        <span
                          className={`text-[13px] leading-tight font-semibold ${channel.isEstimated ? 'text-text-high' : 'text-text-low'}`}
                        >
                          {channel.name}
                        </span>
                        {/* 막대그래프 두 개 사이의 간격: gap-[1.5px] */}
                        <div className="flex w-full flex-col gap-[1.5px]">
                          <MockChannelBar
                            value={channel.impressions.value}
                            fillPercentage={channel.impressions.fillPercentage}
                            fillColor="var(--color-sys-primary-default, #FF6817)"
                            textColor="var(--color-sys-primary-default, #FF6817)"
                            isDimmed={!channel.isEstimated}
                          />
                          <MockChannelBar
                            value={channel.clicks.value}
                            fillPercentage={channel.clicks.fillPercentage}
                            fillColor="var(--chart-sub, #FFB217)"
                            textColor="var(--chart-sub, #FFB217)"
                            isDimmed={!channel.isEstimated}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 범례 (Figma node 3766:110513 스펙 완벽 일치) */}
                <div className="border-outline-lower flex items-center gap-[14.6px] border-t pt-[14.6px]">
                  <div className="flex items-center gap-[4.9px]">
                    <div className="bg-sys-primary-default size-[8px] rounded-full" />
                    <span
                      style={{
                        color: 'var(--color-text-medium, #6E6E76)',
                        fontSize: '9.75px',
                        fontWeight: 500,
                        lineHeight: '14.625px',
                        letterSpacing: '-0.406px',
                      }}
                      className="font-medium"
                    >
                      예상 노출 수
                    </span>
                  </div>
                  <div className="flex items-center gap-[4.9px]">
                    <div className="size-[8px] rounded-full bg-[#FFB217]" />
                    <span
                      style={{
                        color: 'var(--color-text-medium, #6E6E76)',
                        fontSize: '9.75px',
                        fontWeight: 500,
                        lineHeight: '14.625px',
                        letterSpacing: '-0.406px',
                      }}
                      className="font-medium"
                    >
                      예상 클릭 수
                    </span>
                  </div>
                </div>
              </div>

              {/* 카드 3: 결과 산정 안내 (Figma node 3766:110517 | pad [21.1px, 24.4px], background #ECECEE, radius 13px, h: 120px) */}
              <div className="bg-surface-default flex h-[120.1px] flex-col items-center justify-center gap-[6.5px] rounded-[13px] px-[24.4px] py-[21.1px] text-center">
                {/* 물음표 원형 아이콘 (Figma: w:17.875px h:17.875px, bg:#D4D4D8, text:#ECECEE) */}
                <div className="text-surface-default flex size-[17.9px] items-center justify-center rounded-full bg-[#D4D4D8] text-[12.2px] leading-none font-semibold">
                  ?
                </div>
                <span
                  style={{
                    color: 'var(--color-text-default, #52525A)',
                    fontSize: '11.375px',
                    fontWeight: 600,
                    lineHeight: '16.25px',
                    letterSpacing: '-0.406px',
                  }}
                  className="font-semibold"
                >
                  해당 수치는 어떻게 계산됐나요?
                </span>
                <span
                  style={{
                    color: 'var(--color-text-low, #A2A2A8)',
                    fontSize: '9.75px',
                    fontWeight: 500,
                    lineHeight: '14.625px',
                    letterSpacing: '-0.406px',
                  }}
                  className="text-center font-medium whitespace-pre-line"
                >
                  {`각 채널 매체소개서 기준 업계 평균 데이터 기반 추정치예요.\n실제 성과는 소재·타깃 설정에 따라 달라질 수 있어요.`}
                </span>
              </div>
            </div>
          </div>

          {/* 4. 플로팅 필터 토스트 (Figma node 3766:110525 | w: 129px, h: 36.25px, bottom: 32.5px, radius 80px) */}
          <div className="absolute bottom-[32.5px] left-1/2 flex h-[36.25px] w-[129px] -translate-x-1/2 items-center justify-center gap-[8.1px] rounded-[80px] bg-[#3F3F45] px-[19.5px] py-[8.1px] shadow-[0_16px_32px_rgba(0,0,0,0.15)] backdrop-blur-sm">
            <SlidersHorizontal aria-hidden className="size-[13px] text-white" />
            <span className="text-[13px] font-semibold whitespace-nowrap text-white">
              필터 조정하기
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
