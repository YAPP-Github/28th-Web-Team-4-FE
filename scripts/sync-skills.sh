#!/usr/bin/env bash
# Sync project skills from canonical .agents/skills/ → Cursor & Claude paths.
# Edit skills only under .agents/skills/, then run this script before committing.
#
# Claude-only skills (e.g. integration-nextjs-app-router) are left untouched.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
src="${root}/.agents/skills"

if [[ ! -d "$src" ]]; then
  echo "error: missing canonical skills dir: $src" >&2
  exit 1
fi

sync_one() {
  local dest_root="$1"
  mkdir -p "$dest_root"

  local skill_dir
  for skill_dir in "$src"/*/; do
    [[ -d "$skill_dir" ]] || continue
    local name
    name="$(basename "$skill_dir")"
    local dest="${dest_root}/${name}"

    rm -rf "$dest"
    mkdir -p "$dest"
    cp -R "$skill_dir"/. "$dest"/
    echo "synced: ${name} → ${dest_root#"$root"/}/"
  done
}

sync_one "${root}/.cursor/skills"
sync_one "${root}/.claude/skills"

echo "done. (Claude-only skills outside .agents/skills were not modified.)"
