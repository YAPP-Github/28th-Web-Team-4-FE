---
name: github-workflow
description: >-
  GitHub 워크플로(이슈 생성, 브랜치 생성, 커밋, 푸시, draft PR)를 gh와 git으로 수행한다.
  사용자가 이슈·브랜치·커밋·push·PR·gh를 요청하거나 작업이 끝나 커밋이 자연스러울 때 사용한다.
---

# GitHub workflow

레포 스크립트는 `node --run`, GitHub는 `gh`를 쓴다.

권장 순서: **이슈 → 브랜치 → (작업) → 커밋 → 푸시 → draft PR**

## 공통

- 이슈·브랜치·커밋·푸시·PR는 **실행 전 항상 확인**한다 (“할까요?”). 승낙 없이 진행하지 않는다.
- 커밋은 “커밋해” 명시가 없어도 된다. 자연스러우면 먼저 묻고 동의하면 진행한다.
- `git config` 변경 금지. 대화형 git (`-i`, `rebase -i`) 금지.
- force push / hard reset은 명시 요청 때만. `main` force push 금지.
- 훅 건너뛰기 (`--no-verify` 등) 금지 (명시 요청 제외).
- 시크릿(`.env`, Doppler 키 등) 커밋 금지.
- `--amend`는 명시 요청 전엔 하지 않는다. 훅이 커밋을 거절하면 amend 말고 **새 커밋**.
- 이슈·PR body는 아래 템플릿 구조를 그대로 쓴다. 임의 Summary/Test plan 형식 금지.

| 용도      | 경로                                        |
| --------- | ------------------------------------------- |
| PR        | `.github/pull_request_template.md`          |
| 기능 이슈 | `.github/ISSUE_TEMPLATE/feature-request.md` |
| 버그 이슈 | `.github/ISSUE_TEMPLATE/bug_report.md`      |

## 1. 이슈

관련 이슈가 없거나 번호/본문이 없으면 먼저 만든다.  
예외: “이슈 없이/생략”이거나 이미 번호가 있으면 만들지 않는다.

1. 기능·잡일·문서 등 → `feature-request.md` / 버그 → `bug_report.md` (불명확하면 확인)
2. 제목: `feature: …` / `bug: …`
3. `gh issue create` body에는 YAML frontmatter 없이 **본문만**

```bash
gh issue create --title "feature: 짧은 요약" --body "$(cat <<'EOF'
## TODO

- [ ] …

## 기타 참고사항

…
EOF
)"
```

4. 이슈 번호·URL 확보 → PR에 `Closes #n`

## 2. 브랜치

형식: **`{prefix}-{kebab-description}`**  
`prefix`: `feat` / `bug` / `docs` / `chore` / `refactor` (이슈 `feature:` → `feat`)  
예: `feat-add-ai`, `bug-fix-login-redirect`  
공백·`_`·PascalCase·prefix 없는 이름 금지. 이슈 번호는 기본 미포함.

```bash
git checkout main
git pull origin main
git checkout -b feat-add-ai
```

작업 브랜치 위에서 따지 말고 `main` 기준 (사용자가 다른 base를 지정한 경우 제외).

## 3. 커밋

1. `git status`, `git diff` / `--staged`, `git log --oneline -n 10`
2. 관련 파일만 `git add`
3. 메시지: why 중심. `feat:` / `fix:` / `docs:` / `chore:` / `refactor:`

```bash
git commit -m "$(cat <<'EOF'
feat: 변경 이유를 한 문장으로.

EOF
)"
```

4. 훅 실패 시 수정 후 새 커밋. `git status`로 확인.

## 4. 푸시

직전 순서를 모두 통과한 뒤에만 푸시한다. 실패 시 푸시하지 않는다.

```bash
git pull origin "$(git rev-parse --abbrev-ref HEAD)"
node --run fmt:check
node --run lint
node --run build
git push -u origin HEAD
```

- 추적 브랜치가 없으면 fetch 후 없음을 확인하고 최초 `-u` 푸시 가능.
- 충돌 나면 중단 → 해결 → 다시 확인.

## 5. Pull Request (항상 draft)

`--draft`, `--base main`. ready-for-review는 별도 요청 때만.

1. 이슈·브랜치·미푸시가 필요하면 §1–§4를 확인 후 진행
2. `git log main...HEAD`, `git diff main...HEAD`로 범위 파악
3. `.github/pull_request_template.md`를 채워 `--body`로 전달 (`Closes #n` 포함)

```bash
gh pr create --draft --base main --title "제목" --body "$(cat <<'EOF'
## 무엇을 변경했나요?
…
## 왜 변경했나요?
Closes #n
## 확인 사항
…
EOF
)"
```

4. draft PR URL을 돌려준다.

## 조회

`gh issue view <n>` / `gh pr view` / `gh pr checks`
