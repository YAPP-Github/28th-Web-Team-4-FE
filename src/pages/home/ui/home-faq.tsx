'use client';

import { type JSX, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Q. 채소집은 어떤 서비스인가요?',
    answer:
      '채소집은 광고 채널 소개를 한곳에 모아둔 서비스예요. 광고하려는 서비스 정보를 입력하면 그에 맞는 광고 채널을 추천받을 수 있고,\n채널별로 비교하거나 생각 중인 예산으로 채널별 예상 성과를 시뮬레이션해볼 수도 있어요.',
  },
  {
    id: 'faq-2',
    question: 'Q. 마케팅이나 광고 집행이 처음이어도 쉽게 쓸 수 있나요?',
    answer:
      '네, 처음이셔도 편하게 사용하실 수 있어요. 어려운 광고 용어도 누구나 쉽게 이해할 수 있도록 풀어서 설명해드리고 있어요.',
  },
  {
    id: 'faq-3',
    question: 'Q. 추천 결과와 예상 수치는 어떻게 계산되나요?',
    answer:
      '입력해주신 정보와 각 매체 소개서에 기재된 정보를 기준으로 계산돼요.\n업종, 예산, 타깃 등 여러 조건을 종합해 채널별 적합도와 예상 성과를 산출해드려요.',
  },
  {
    id: 'faq-4',
    question: 'Q. 시뮬레이션 결과와 실제 광고 성과가 다를 수도 있나요?',
    answer:
      '네, 다를 수 있어요. 시뮬레이션 결과는 참고용 예상치이며, 실제 성과는 소재나 운영 방식 등에 따라 달라질 수 있어요.\n정확한 성과는 해당 매체와의 상세 상담을 통해 확인하시는 걸 추천드려요.',
  },
  {
    id: 'faq-5',
    question: 'Q. 추천받은 결과를 나중에 다시 볼 수 있나요?',
    answer:
      "네, 가능해요. 결과 화면에서 '저장하기' 버튼을 누르면 마이페이지에서 언제든 다시 확인하실 수 있어요.",
  },
];

export function HomeFaq(): JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-labelledby="faq-title"
      className="w-full bg-[var(--color-surface-background-white,#FFFFFF)] py-[80px] sm:py-[100px] lg:py-[120px]"
    >
      <div className="px-016 sm:px-032 mx-auto flex w-full max-w-[1440px] flex-col gap-[36px] sm:gap-[44px] lg:gap-[48px] lg:px-120">
        {/* 섹션 타이틀 */}
        <h2
          id="faq-title"
          className="font-pre text-[26px] leading-[1.3] font-bold tracking-[-1px] text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[32px] sm:leading-[52px] lg:text-[36px]"
        >
          자주 묻는 질문
        </h2>

        {/* FAQ 아코디언 리스트 */}
        <div className="flex w-full flex-col border-t border-[var(--color-primitive-gray-200,#E4E4E7)]">
          {FAQ_LIST.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => toggleFaq(item.id)}
                className="group flex w-full cursor-pointer flex-col border-b border-[var(--color-primitive-gray-200,#E4E4E7)] transition-colors hover:bg-[var(--color-primitive-gray-50,#FAFAFA)]"
              >
                {/* 질문 트리거 버튼 */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-[16px] px-[6px] py-[22px] text-left sm:px-[10px] sm:py-[24px]"
                >
                  <span className="font-pre text-[17px] leading-[1.4] font-bold tracking-[-0.5px] break-keep text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[19px] sm:leading-[32px] lg:text-[20px]">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.24, ease: 'easeInOut' }}
                    className="shrink-0 text-[var(--color-primitive-gray-400,#A2A2A8)]"
                  >
                    <ChevronDown aria-hidden className="size-[22px] sm:size-[24px]" />
                  </motion.div>
                </button>

                {/* 답변 콘텐츠 (Framer Motion 아코디언 열림/닫힘) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.25, delay: 0.05 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-[4px] pr-[6px] pb-[24px] pl-[28px] sm:pr-[10px] sm:pl-[32px]">
                        <p className="font-pre text-[16px] leading-[1.6] font-medium tracking-[-0.5px] break-keep whitespace-pre-line text-[var(--color-primitive-gray-600,#6E6E76)] sm:text-[18px] sm:leading-[32px] lg:text-[20px]">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
