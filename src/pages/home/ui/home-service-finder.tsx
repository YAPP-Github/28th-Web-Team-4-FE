'use client';

import { ArrowUp } from 'lucide-react';

import { useMyProfile } from '@/pages/mypage/api/use-my-profile';
import { useHomeServiceNameForm } from '@/pages/home/model/use-home-service-name-form';
import { HomeHeroServicePreview } from './home-hero-service-preview';

export function HomeServiceFinder(): JSX.Element {
  const { data: profile } = useMyProfile();
  const { canSubmit, handleSubmit, serviceName, setServiceName } = useHomeServiceNameForm();

  const userName = profile?.name ?? '채소집';

  return (
    <section
      aria-label="맞춤 채널 찾기"
      className="bg-surface-lowest relative flex w-full flex-col items-center justify-start overflow-hidden pt-[60px] pb-[100px] sm:pt-[80px] sm:pb-[120px] lg:pt-[100px] lg:pb-[140px]"
    >
      {/* 피그마 3766:116121 1:1 80px 배경 그리드 (피그마 원본 색상 #F4F4F6) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="size-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #F4F4F6 1px, transparent 1px),
              linear-gradient(to bottom, #F4F4F6 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            backgroundPosition: 'center top',
          }}
        />
        {/* 상단 124px / 좌우 240px / 하단 180px 화이트 페이드아웃 그라데이션 */}
        <div className="absolute inset-x-0 top-0 h-[124px] bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-t from-white via-white/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[240px] bg-gradient-to-r from-white via-white/70 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[240px] bg-gradient-to-l from-white via-white/70 to-transparent" />
      </div>

      <div className="px-016 sm:px-032 relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[36px] sm:gap-[44px] lg:gap-[52px] lg:px-120">
        {/* 상단 타이포그래피 헤더 */}
        <div className="flex flex-col items-center gap-[6px] text-center sm:gap-[8px]">
          <span className="font-pre text-surface-higher text-[16px] font-semibold tracking-[-0.5px] sm:text-[20px] lg:text-[22px] lg:leading-[32px]">
            FIND YOUR FIT
          </span>
          <h2 className="font-pre text-text-highest text-[26px] font-bold tracking-[-1px] break-keep whitespace-pre-line sm:text-[38px] sm:leading-[54px] lg:text-[48px] lg:leading-[70px]">
            안녕하세요, {userName} 님!
            {'\n'}
            딱 맞는 채널을 찾아드릴게요
          </h2>
        </div>

        {/* 피그마 3766:116117 1:1 input-bar 검색창 (테두리를 따라 빛이 부드럽게 파도치며 흐르는 쉬머 그라데이션) */}
        <form
          onSubmit={handleSubmit}
          className="relative flex h-[58px] w-full max-w-[480px] items-center rounded-full p-[2px] shadow-[0_4px_24px_rgba(255,104,23,0.14)] transition-all focus-within:scale-[1.01] focus-within:shadow-[0_8px_32px_rgba(255,104,23,0.26)] sm:h-[60px]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #FF6817 0%, #FFD1B2 25%, #FF8E4D 50%, #FFCEF4 75%, #FF6817 100%)',
            backgroundSize: '200% 100%',
            animation: 'finderBorderShimmer 4s linear infinite',
          }}
        >
          <style>{`
            @keyframes finderBorderShimmer {
              0% {
                background-position: 0% 50%;
              }
              100% {
                background-position: 200% 50%;
              }
            }
          `}</style>

          <div className="bg-surface-lowest relative z-10 flex size-full items-center justify-between rounded-full pr-[10px] pl-[22px] sm:pr-[12px] sm:pl-[26px]">
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="광고하고 싶은 서비스의 이름을 입력해 보세요"
              className="font-pre text-text-highest placeholder:text-text-low w-full flex-1 bg-transparent text-[14px] font-medium tracking-tight outline-none sm:text-[16px]"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              aria-label="추천 시작하기"
              className="bg-sys-primary-default hover:bg-sys-primary-high focus-visible:outline-sys-primary-default flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full text-white shadow-sm transition-all outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp aria-hidden className="size-[20px] stroke-[2.5]" />
            </button>
          </div>
        </form>

        {/* 피그마 3766:116117 예산 시뮬레이션 결과 프리뷰 */}
        <div className="w-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.06)]">
          <HomeHeroServicePreview />
        </div>
      </div>
    </section>
  );
}
