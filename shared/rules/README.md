# Agent rules (SSOT)

도구 중립 rule 원본은 **`shared/rules/`** 다.  
FSD의 `src/shared/`와 경로가 다르다 (루트 `shared/` = 에이전트 하네스).

- 수정: `shared/rules/<name>.md` 만
- 배포: `node --run rules:sync` → `.cursor/rules/*.mdc`, `.claude/rules/*.md` 생성  
  (Cursor / Claude frontmatter 형식이 달라 symlink가 아니라 **생성**한다)

`alwaysApply` · `globs` · `claudeFile`은 각 파일 frontmatter에 둔다.
