# Agent skills (SSOT)

도구 중립 스킬 원본은 **`shared/skills/`** 다.  
FSD의 `src/shared/`와 경로가 다르다 (루트 `shared/` = 에이전트 하네스).

- `.agents/skills/<name>` → `../../shared/skills/<name>` (symlink)
- `.cursor/skills/<name>` → `../../shared/skills/<name>` (symlink)
- `.claude/skills/<name>` → `../../shared/skills/<name>` (symlink)

Claude 전용 스킬(예: PostHog `integration-nextjs-app-router`)은 `.claude/skills/`에만 두고 여기로 옮기지 않는다.

링크 재생성: `node --run skills:sync`
