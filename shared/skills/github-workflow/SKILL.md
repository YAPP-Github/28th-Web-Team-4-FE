---
name: github-workflow
description: >-
  Linear 이슈를 기준으로 브랜치 생성, 커밋, 푸시, GitHub draft PR까지 수행한다.
  사용자가 Linear/GitHub 이슈·브랜치·커밋·push·PR·gh를 요청하거나 작업이 끝나 커밋이 자연스러울 때 사용한다.
---

# GitHub workflow

레포 스크립트는 `node --run`, GitHub는 `gh`를 쓴다.

권장 순서: **Linear 이슈 → 브랜치 → (작업) → 커밋 → 푸시 → draft PR**

## 공통

- 이슈·브랜치·커밋·푸시·PR는 **실행 전 항상 확인**한다 (“할까요?”). 승낙 없이 진행하지 않는다.
- 커밋은 “커밋해” 명시가 없어도 된다. 자연스러우면 먼저 묻고 동의하면 진행한다.
- `git config` 변경 금지. 대화형 git (`-i`, `rebase -i`) 금지.
- force push / hard reset은 명시 요청 때만. `main` force push 금지.
- 훅 건너뛰기 (`--no-verify` 등) 금지 (명시 요청 제외).
- 시크릿(`.env`, Doppler 키 등) 커밋 금지.
- `--amend`는 명시 요청 전엔 하지 않는다. 훅이 커밋을 거절하면 amend 말고 **새 커밋**.
- GitHub Issue·PR body는 아래 템플릿 구조를 그대로 쓴다. 임의 Summary/Test plan 형식 금지.

| 용도      | 경로                                        |
| --------- | ------------------------------------------- |
| PR        | `.github/pull_request_template.md`          |
| 기능 이슈 | `.github/ISSUE_TEMPLATE/feature-request.md` |
| 버그 이슈 | `.github/ISSUE_TEMPLATE/bug_report.md`      |

## 1. 이슈 (Linear 우선)

기본 이슈 관리자는 Linear다. 관련 Linear 이슈가 없거나 ID/본문이 없으면 먼저 만든다.

예외: “이슈 없이/생략”이거나 이미 Linear ID와 본문이 있으면 만들지 않는다.

1. 대화, 첨부 파일, 브랜치명에서 `CHA-68` 형태의 Linear ID와 이슈 URL을 먼저 찾는다.
2. Linear 연결 도구가 있으면 올바른 팀에 이슈를 생성하고 ID·URL을 확보한다. 팀이 불명확하면 확인한다.
3. Linear 연결 도구가 없으면 GitHub Issue로 임의 대체하지 말고 Linear 이슈 생성 또는 기존 ID·URL 제공을 요청한다.
4. 사용자가 GitHub Issue를 명시한 경우에만 저장소 템플릿을 사용해 생성한다.

GitHub Issue를 명시한 경우:

1. 기능·잡일·문서 등 → `feature-request.md` / 버그 → `bug_report.md` (불명확하면 확인)
2. 제목: `feature: …` / `bug: …`
3. `gh issue create` body에는 YAML frontmatter 없이 **본문만** 넣는다.

```bash
gh issue create --title "feature: 짧은 요약" --body "$(cat <<'EOF'
## TODO

- [ ] …

## 기타 참고사항

…
EOF
)"
```

4. 이슈 번호·URL을 확보하고 PR에 `Closes #n`을 넣는다.

## 2. 브랜치

브랜치 이름은 반드시 영어로 작성한다. Linear 이슈 제목이나 사용자 설명이 한글이어도 브랜치 설명 구간은 영어로 번역해서 만든다.

Linear 이슈가 있으면 형식은 **`{linear-id}-{prefix}-{english-kebab-description}`**으로 한다.

`linear-id`: 소문자 Linear ID (예: `cha-68`)

`prefix`: `feat` / `fix` / `docs` / `chore` / `refactor`

예: `cha-68-fix-mobile-subheader-layout`

설명은 영어 소문자 ASCII만 쓴다. 한글·공백·`_`·PascalCase·prefix 없는 이름은 금지한다. 특히 Linear 이슈 기반으로 브랜치를 만들 때 이슈 제목을 그대로 한글 slug로 옮기지 않는다.

브랜치 생성 전 체크:

1. Linear ID를 소문자로 변환한다. 예: `CHA-68` → `cha-68`
2. 이슈 제목/요청 내용을 3-6단어 영어 설명으로 번역한다.
3. 영어 설명을 kebab-case로 변환한다.
4. 최종 브랜치명이 `^[a-z0-9]+-[0-9]+-(feat|fix|docs|chore|refactor)-[a-z0-9]+(-[a-z0-9]+)*$`에 맞는지 확인한다.
5. 한글이 한 글자라도 포함되면 브랜치 생성 명령을 실행하지 말고 영어 브랜치명으로 다시 만든다.

금지 예:

```text
cha-68-fix-모바일-서브헤더-레이아웃
cha-68-fix_mobile_subheader_layout
cha-68-Fix-Mobile-Subheader-Layout
```

이슈를 명시적으로 생략한 경우에만 `{prefix}-{english-kebab-description}`을 쓴다.

```bash
git checkout main
git pull origin main
git checkout -b cha-68-fix-mobile-subheader-layout
```

작업 브랜치 위에서 따지 말고 `main` 기준 (사용자가 다른 base를 지정한 경우 제외).

## 3. 커밋

1. `git status`, `git diff` / `--staged`, `git log --oneline -n 10`
2. 관련 파일만 `git add`
3. 커밋 메시지는 한글로 작성한다. 단, conventional commit type prefix는 `feat:` / `fix:` / `docs:` / `chore:` / `refactor:`를 유지한다. 본문은 why 중심으로 쓴다.

```bash
git commit -m "$(cat <<'EOF'
feat: 변경 이유를 한글 한 문장으로 설명

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
3. `.github/pull_request_template.md`를 채워 `--body`로 전달한다.
4. Linear 이슈 URL과 `Closes {LINEAR-ID}`를 본문에 각각 명시한다. 여러 이슈면 한 줄에 하나씩 쓴다.
5. GitHub Issue를 명시적으로 사용한 경우에만 `Closes #n`을 넣는다.
6. PR 제목의 Linear ID는 권장한다. 브랜치명에 ID가 있으면 생략할 수 있다.

```bash
gh pr create --draft --base main --title "제목" --body "$(cat <<'EOF'
## 무엇을 변경했나요?
…
## 왜 변경했나요?
Linear: https://linear.app/…/issue/CHA-68/…

Closes CHA-68
## 확인 사항
…
EOF
)"
```

7. 생성 후 PR 본문에 Linear URL과 종료 문구가 실제로 들어갔는지 `gh pr view`로 확인한다.
8. draft PR URL을 돌려준다.

## 조회

Linear 연결 도구 / `gh issue view <n>` / `gh pr view` / `gh pr checks`
