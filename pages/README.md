# Empty `pages` directory (Next.js + FSD)

Next.js App Router와 FSD `src/pages`를 함께 쓸 때, 루트에 이 빈 `pages/` 폴더가 필요합니다.
그렇지 않으면 Next가 `src/pages`를 Pages Router로 오인할 수 있습니다.

라우트 코드는 여기에 넣지 마세요.

- Next 라우팅: 프로젝트 루트 `app/`
- FSD pages: `src/pages/`

참고: https://fsd.how/kr/docs/guides/tech/with-nextjs/
