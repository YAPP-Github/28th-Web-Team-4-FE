import { readFileSync } from 'node:fs';

// An optional path also supports checking a rendered task definition locally.
const definitionPath = process.argv[2] ?? new URL('../task-definition.json', import.meta.url);

try {
  const definition = JSON.parse(readFileSync(definitionPath, 'utf8'));
  const taskCpu = Number(definition.cpu);

  if (!Number.isSafeInteger(taskCpu) || taskCpu <= 0) {
    throw new Error('Task cpu must be a positive integer in CPU units.');
  }

  if (!Array.isArray(definition.containerDefinitions) || !definition.containerDefinitions.length) {
    throw new Error('Task definition must contain at least one container.');
  }

  let containerCpu = 0;
  const allocations = [];

  for (const container of definition.containerDefinitions) {
    // ECS allows container cpu to be omitted (no explicit reservation).
    const cpu = container.cpu === undefined ? 0 : container.cpu;
    if (!Number.isSafeInteger(cpu) || cpu < 0) {
      throw new Error(`Container ${container.name} cpu must be a non-negative integer.`);
    }
    containerCpu += cpu;
    allocations.push(`${container.name}=${cpu}`);
  }

  if (containerCpu > taskCpu) {
    throw new Error(
      `Container CPU sum ${containerCpu} exceeds task CPU ${taskCpu} (${allocations.join(', ')}).`,
    );
  }

  process.stdout.write(`ECS CPU allocation valid: ${containerCpu} <= ${taskCpu}.\n`);
} catch (error) {
  process.stderr.write(`ECS CPU validation failed: ${error.message}\n`);
  process.exitCode = 1;
}
