#!/usr/bin/env node
/**
 * Generate Cursor (.mdc) and Claude (.md) rules from shared/rules/*.md (SSOT).
 * Edit only under shared/rules/, then: node --run rules:sync
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'shared/rules');
const cursorDir = path.join(root, '.cursor/rules');
const claudeDir = path.join(root, '.claude/rules');

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) {
    throw new Error('missing frontmatter');
  }
  const end = raw.indexOf('\n---\n', 4);
  if (end === -1) {
    throw new Error('unclosed frontmatter');
  }
  const fm = raw.slice(4, end);
  const body = raw.slice(end + 5).replace(/^\n/, '');

  /** @type {Record<string, unknown>} */
  const meta = {
    description: '',
    alwaysApply: false,
    globs: [],
    claudeFile: '',
  };

  let currentList = null;
  for (const line of fm.split('\n')) {
    if (/^\s+-\s+/.test(line) && currentList) {
      currentList.push(line.replace(/^\s+-\s+/, '').trim());
      continue;
    }
    currentList = null;
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) {
      continue;
    }
    const [, key, value] = m;
    if (key === 'description') {
      meta.description = value.trim();
    } else if (key === 'alwaysApply') {
      meta.alwaysApply = value.trim() === 'true';
    } else if (key === 'claudeFile') {
      meta.claudeFile = value.trim();
    } else if (key === 'globs') {
      meta.globs = [];
      currentList = /** @type {string[]} */ (meta.globs);
      if (value.trim()) {
        currentList.push(value.trim());
      }
    }
  }

  return { meta, body };
}

function writeCursor(name, meta, body) {
  const lines = ['---', `description: ${meta.description}`];
  if (meta.alwaysApply) {
    lines.push('alwaysApply: true');
  } else {
    lines.push(`globs: ${/** @type {string[]} */ (meta.globs).join(',')}`);
    lines.push('alwaysApply: false');
  }
  lines.push('---', '', body.replace(/\s+$/, ''), '');
  const out = path.join(cursorDir, `${name}.mdc`);
  fs.writeFileSync(out, lines.join('\n'));
  console.log(`wrote: .cursor/rules/${name}.mdc`);
}

function writeClaude(meta, body) {
  const claudeFile = String(meta.claudeFile ?? '');
  if (!claudeFile) {
    throw new Error('claudeFile is required');
  }
  const globs = /** @type {string[]} */ (meta.globs);
  let content;
  if (meta.alwaysApply || globs.length === 0) {
    content = `${body.replace(/\s+$/, '')}\n`;
  } else {
    const paths = globs.map((g) => `  - "${g}"`).join('\n');
    content = `---\npaths:\n${paths}\n---\n\n${body.replace(/\s+$/, '')}\n`;
  }
  const out = path.join(claudeDir, claudeFile);
  fs.writeFileSync(out, content);
  console.log(`wrote: .claude/rules/${claudeFile}`);
}

function main() {
  if (!fs.existsSync(srcDir)) {
    console.error(`error: missing SSOT rules dir: ${srcDir}`);
    process.exit(1);
  }
  fs.mkdirSync(cursorDir, { recursive: true });
  fs.mkdirSync(claudeDir, { recursive: true });

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort();

  if (files.length === 0) {
    console.error('error: no rule files in shared/rules');
    process.exit(1);
  }

  for (const file of files) {
    const name = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(srcDir, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    writeCursor(name, meta, body);
    writeClaude(meta, body);
  }

  console.log('done. Edit shared/rules/ then re-run node --run rules:sync');
}

main();
