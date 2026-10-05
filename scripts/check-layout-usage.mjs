#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

/** @typedef {'display' | 'direction' | 'align' | 'justify'} UtilityProperty */
/**
 * @typedef {object} LayoutFinding
 * @property {string} file
 * @property {number} line
 * @property {number} column
 * @property {'no-spacing' | 'box-layout' | 'native-layout' | 'layout-invariant'} rule
 * @property {string} component
 * @property {string[]} classes
 * @property {string} message
 */
/**
 * @typedef {object} CliOptions
 * @property {boolean} changed
 * @property {boolean} strict
 * @property {boolean} help
 */

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectories = ['src', 'app'];
const layoutImplementationDirectory = 'src/shared/ui/layout/';

/** @type {Map<string, string>} */
const layoutModules = new Map([
  ['@/shared/ui/layout/box', 'Box'],
  ['@/shared/ui/layout/center', 'Center'],
  ['@/shared/ui/layout/center-stack', 'CenterStack'],
  ['@/shared/ui/layout/flex', 'Flex'],
  ['@/shared/ui/layout/grid', 'Grid'],
  ['@/shared/ui/layout/h-stack', 'HStack'],
  ['@/shared/ui/layout/justify-between', 'JustifyBetween'],
  ['@/shared/ui/layout/justify-end', 'JustifyEnd'],
  ['@/shared/ui/layout/spacing', 'Spacing'],
  ['@/shared/ui/layout/stack', 'Stack'],
  ['@/shared/ui/layout/v-stack', 'VStack'],
]);

const displayUtilities = new Set([
  'block',
  'contents',
  'flex',
  'flow-root',
  'grid',
  'hidden',
  'inline',
  'inline-block',
  'inline-flex',
  'inline-grid',
  'inline-table',
  'list-item',
  'table',
  'table-caption',
  'table-cell',
  'table-column',
  'table-column-group',
  'table-footer-group',
  'table-header-group',
  'table-row',
  'table-row-group',
]);
const layoutDisplayUtilities = new Set(['flex', 'inline-flex', 'grid', 'inline-grid']);
const directionUtilities = new Set([
  'flex-row',
  'flex-row-reverse',
  'flex-col',
  'flex-col-reverse',
]);
const alignUtilities = new Set([
  'items-start',
  'items-end',
  'items-center',
  'items-baseline',
  'items-baseline-last',
  'items-stretch',
  'items-end-safe',
  'items-center-safe',
]);
const justifyUtilities = new Set([
  'justify-normal',
  'justify-start',
  'justify-end',
  'justify-center',
  'justify-between',
  'justify-around',
  'justify-evenly',
  'justify-stretch',
  'justify-baseline',
  'justify-end-safe',
  'justify-center-safe',
]);

/** @type {Record<string, Partial<Record<UtilityProperty, string>>>} */
const invariantUtilities = {
  Center: { display: 'flex', align: 'items-center', justify: 'justify-center' },
  CenterStack: {
    display: 'flex',
    direction: 'flex-col',
    align: 'items-center',
    justify: 'justify-center',
  },
  Flex: { display: 'flex' },
  Grid: { display: 'grid' },
  HStack: { display: 'flex', align: 'items-center' },
  JustifyBetween: { display: 'flex', justify: 'justify-between' },
  JustifyEnd: { display: 'flex', justify: 'justify-end' },
  Stack: { display: 'flex', direction: 'flex-col' },
  VStack: { display: 'flex', direction: 'flex-col', align: 'items-center' },
};

/** @type {Array<[UtilityProperty, Set<string>]>} */
const utilityGroups = [
  ['display', displayUtilities],
  ['direction', directionUtilities],
  ['align', alignUtilities],
  ['justify', justifyUtilities],
];

/** @param {string} className */
function getBaseUtility(className) {
  let bracketDepth = 0;
  let lastVariantSeparator = -1;

  for (let index = 0; index < className.length; index += 1) {
    const character = className[index];
    if (character === '[' || character === '(') {
      bracketDepth += 1;
    } else if (character === ']' || character === ')') {
      bracketDepth = Math.max(0, bracketDepth - 1);
    } else if (character === ':' && bracketDepth === 0) {
      lastVariantSeparator = index;
    }
  }

  return className
    .slice(lastVariantSeparator + 1)
    .replace(/^!/, '')
    .replace(/!$/, '');
}

/**
 * @param {string} utility
 * @returns {UtilityProperty | undefined}
 */
function getUtilityProperty(utility) {
  return utilityGroups.find(([, utilities]) => utilities.has(utility))?.[0];
}

/**
 * @param {import('typescript').Node} initializer
 * @returns {string[]}
 */
function getClassTokens(initializer) {
  /** @type {string[]} */
  const classValues = [];

  /** @param {import('typescript').Node} node */
  function visit(node) {
    if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      classValues.push(node.text);
    }
    ts.forEachChild(node, visit);
  }

  visit(initializer);

  return [...new Set(classValues.flatMap((value) => value.split(/\s+/)).filter(Boolean))];
}

/**
 * @param {import('typescript').SourceFile} sourceFile
 * @param {import('typescript').Node} node
 */
function getLocation(sourceFile, node) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return { line: line + 1, column: character + 1 };
}

/**
 * @param {import('typescript').SourceFile} sourceFile
 * @returns {{ imports: Map<string, string>, spacingImports: import('typescript').ImportSpecifier[] }}
 */
function getImportedLayouts(sourceFile) {
  /** @type {Map<string, string>} */
  const imports = new Map();
  /** @type {import('typescript').ImportSpecifier[]} */
  const spacingImports = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }

    const component = layoutModules.get(statement.moduleSpecifier.text);
    const namedBindings = statement.importClause?.namedBindings;
    if (!component || !namedBindings || !ts.isNamedImports(namedBindings)) {
      continue;
    }

    for (const element of namedBindings.elements) {
      const importedName = element.propertyName?.text ?? element.name.text;
      if (importedName !== component) {
        continue;
      }

      imports.set(element.name.text, component);
      if (component === 'Spacing') {
        spacingImports.push(element);
      }
    }
  }

  return { imports, spacingImports };
}

/**
 * @param {string} source
 * @param {string} [file]
 * @returns {LayoutFinding[]}
 */
export function analyzeSource(source, file = 'source.tsx') {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const { imports, spacingImports } = getImportedLayouts(sourceFile);
  /** @type {LayoutFinding[]} */
  const findings = spacingImports.map((node) => ({
    file,
    ...getLocation(sourceFile, node),
    rule: 'no-spacing',
    component: 'Spacing',
    classes: [],
    message: 'Spacing 대신 Box 또는 부모의 gap·padding·margin을 사용하세요.',
  }));

  /** @param {import('typescript').Node} node */
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tagName = ts.isIdentifier(node.tagName) ? node.tagName.text : undefined;
      const classNameAttribute = node.attributes.properties.find(
        (attribute) =>
          ts.isJsxAttribute(attribute) &&
          ts.isIdentifier(attribute.name) &&
          attribute.name.text === 'className',
      );

      if (!tagName || !classNameAttribute?.initializer) {
        ts.forEachChild(node, visit);
        return;
      }

      const classTokens = getClassTokens(classNameAttribute.initializer);
      const layoutClasses = classTokens.filter((className) =>
        layoutDisplayUtilities.has(getBaseUtility(className)),
      );
      const component = imports.get(tagName);
      const location = getLocation(sourceFile, node);

      if (component === 'Box' && layoutClasses.length > 0) {
        findings.push({
          file,
          ...location,
          rule: 'box-layout',
          component,
          classes: layoutClasses,
          message: 'Box에서 flex/grid를 조립하지 말고 의도에 맞는 Layout을 사용하세요.',
        });
      } else if (/^[a-z]/.test(tagName) && layoutClasses.length > 0) {
        findings.push({
          file,
          ...location,
          rule: 'native-layout',
          component: tagName,
          classes: layoutClasses,
          message: `${tagName} 태그를 Layout의 as로 보존할 수 있는지 확인하세요.`,
        });
      }

      const invariants = component ? invariantUtilities[component] : undefined;
      if (invariants) {
        const ownedClasses = classTokens.filter((className) => {
          const utility = getBaseUtility(className);
          const property = getUtilityProperty(utility);
          return property && property in invariants;
        });

        if (ownedClasses.length > 0) {
          const hasConflict = ownedClasses.some((className) => {
            const utility = getBaseUtility(className);
            const property = getUtilityProperty(utility);
            return property && invariants[property] !== utility;
          });
          findings.push({
            file,
            ...location,
            rule: 'layout-invariant',
            component,
            classes: ownedClasses,
            message: hasConflict
              ? `${component}의 불변 속성과 충돌합니다. 다른 Layout을 선택하세요.`
              : `${component} 호출부에서 이미 제공되는 불변 클래스를 제거하세요.`,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return findings;
}

/**
 * @param {string} directory
 * @returns {string[]}
 */
function walkTsxFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return walkTsxFiles(entryPath);
    }
    return entry.isFile() && entry.name.endsWith('.tsx') ? [entryPath] : [];
  });
}

/**
 * @param {string[]} arguments_
 * @returns {string[]}
 */
function runGit(arguments_) {
  const result = spawnSync('git', arguments_, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.status !== 0) {
    const errorMessage = result.stderr.trim();
    if (errorMessage.length > 0) {
      throw new Error(errorMessage);
    }
    throw new Error(`git ${arguments_.join(' ')} 실행에 실패했습니다.`);
  }

  return result.stdout.split('\n').filter(Boolean);
}

function resolveBaseReference() {
  for (const reference of ['origin/main', 'main']) {
    const result = spawnSync('git', ['rev-parse', '--verify', '--quiet', reference], {
      cwd: repositoryRoot,
    });
    if (result.status === 0) {
      return reference;
    }
  }
  return 'HEAD';
}

function collectChangedFiles() {
  const baseReference = resolveBaseReference();
  const paths = new Set([
    ...runGit([
      'diff',
      '--name-only',
      '--diff-filter=ACMR',
      `${baseReference}...HEAD`,
      '--',
      ...sourceDirectories,
    ]),
    ...runGit(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD', '--', ...sourceDirectories]),
    ...runGit(['ls-files', '--others', '--exclude-standard', '--', ...sourceDirectories]),
  ]);

  return [...paths]
    .filter((file) => file.endsWith('.tsx'))
    .filter((file) => !file.startsWith(layoutImplementationDirectory))
    .filter((file) => fs.existsSync(path.join(repositoryRoot, file)))
    .sort((left, right) => left.localeCompare(right));
}

function collectAllFiles() {
  return sourceDirectories
    .flatMap((directory) => walkTsxFiles(path.join(repositoryRoot, directory)))
    .map((file) => path.relative(repositoryRoot, file).split(path.sep).join('/'))
    .filter((file) => !file.startsWith(layoutImplementationDirectory))
    .sort((left, right) => left.localeCompare(right));
}

/**
 * @param {string[]} arguments_
 * @returns {CliOptions}
 */
export function parseArguments(arguments_) {
  const options = { changed: false, strict: false, help: false };

  for (const argument of arguments_) {
    if (argument === '--changed') {
      options.changed = true;
    } else if (argument === '--strict') {
      options.strict = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else {
      throw new Error(`알 수 없는 옵션: ${argument}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node --run layout:check -- [options]

Options:
  --changed  origin/main 이후와 현재 작업 트리에서 변경된 TSX만 검사
  --strict   후보가 하나라도 있으면 종료 코드 1 반환
  --help     도움말 출력`);
}

function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 2;
    return;
  }

  if (options.help) {
    printHelp();
    return;
  }

  let files;
  try {
    files = options.changed ? collectChangedFiles() : collectAllFiles();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 2;
    return;
  }

  const findings = files
    .flatMap((file) =>
      analyzeSource(fs.readFileSync(path.join(repositoryRoot, file), 'utf8'), file),
    )
    .sort(
      (left, right) =>
        left.file.localeCompare(right.file) ||
        left.line - right.line ||
        left.rule.localeCompare(right.rule),
    );

  if (findings.length === 0) {
    console.log(`Layout 사용 후보가 없습니다. (${files.length}개 파일 검사)`);
    return;
  }

  console.log(`Layout 사용 후보 ${findings.length}건 (${files.length}개 파일 검사)`);
  for (const finding of findings) {
    const classes = finding.classes.length > 0 ? ` [${finding.classes.join(', ')}]` : '';
    console.log(
      `${finding.file}:${finding.line}:${finding.column} ${finding.rule}${classes} ${finding.message}`,
    );
  }

  if (options.strict) {
    console.error('\n--strict: Layout 사용 후보가 있어 검사에 실패했습니다.');
    process.exitCode = 1;
  } else {
    console.log('\n보고 모드: 후보가 있어도 성공으로 종료합니다. 필요할 때 --strict를 사용하세요.');
  }
}

const isMainModule = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isMainModule) {
  main();
}
