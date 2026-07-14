#!/usr/bin/env bash
# Recreate symlinks from shared/skills/ (SSOT) → tool skill dirs.
# Edit skills only under shared/skills/. Claude-only skills in .claude/skills are left alone.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
src="${root}/shared/skills"

if [[ ! -d "$src" ]]; then
  echo "error: missing SSOT skills dir: $src" >&2
  exit 1
fi

link_one() {
  local dest_root="$1"
  mkdir -p "$dest_root"

  local skill_dir
  for skill_dir in "$src"/*/; do
    [[ -d "$skill_dir" ]] || continue
    local name
    name="$(basename "$skill_dir")"
    local dest="${dest_root}/${name}"
    local target="../../shared/skills/${name}"

    rm -rf "$dest"
    ln -s "$target" "$dest"
    echo "linked: ${dest_root#"$root"/}/${name} → ${target}"
  done
}

link_one "${root}/.agents/skills"
link_one "${root}/.cursor/skills"
link_one "${root}/.claude/skills"

echo "done. (Claude-only skills that are not under shared/skills were not modified.)"
