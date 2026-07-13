# Project skills (canonical)

공통 스킬의 **원본**은 이 디렉터리(`.agents/skills/`)다.

1. 여기서 `SKILL.md`를 수정한다.
2. `node --run skills:sync` (또는 `bash scripts/sync-skills.sh`)로 `.cursor/skills/`·`.claude/skills/`에 복사한다.
3. 세 경로를 함께 커밋한다.

Claude에만 있는 스킬(예: `integration-nextjs-app-router`)은 여기에 두지 않으며 sync가 덮어쓰지 않는다.
