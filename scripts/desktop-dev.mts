import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

if (process.platform !== 'darwin' || process.arch !== 'arm64') {
  throw new Error('현재 데스크톱 개발 환경은 Apple Silicon Mac을 대상으로 합니다.');
}

const setup = spawnSync(
  'doppler',
  ['setup', '--project', 'frontend', '--config', 'dev', '--no-interactive'],
  { cwd: root, stdio: 'inherit' },
);
if (setup.error || setup.status !== 0) {
  throw new Error('Doppler 개발 설정을 확인해 주세요.', { cause: setup.error });
}

function isAvailable(port: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const server = createServer();
    server.once('error', () => resolve(false));
    server.listen(port, () => server.close(() => resolve(true)));
  });
}

let port;
for (let candidate = 3000; candidate <= 3004; candidate += 1) {
  if (await isAvailable(candidate)) {
    port = candidate;
    break;
  }
}
if (port === undefined) {
  throw new Error('3000~3004 포트가 모두 사용 중입니다. 개발 서버 하나를 종료해 주세요.');
}

const config = {
  build: {
    devUrl: `http://localhost:${port}`,
    beforeDevCommand: {
      script: `doppler run -- node --run dev -- --port ${port}`,
      wait: false,
    },
  },
};
process.stdout.write(`채소ZIP 데스크톱 개발 서버: ${config.build.devUrl}\n`);

// Tauri가 웹 개발 서버의 시작·준비 대기·종료를 관리한다.
const child = spawn(
  process.execPath,
  ['node_modules/@tauri-apps/cli/tauri.js', 'dev', '--config', JSON.stringify(config)],
  { cwd: root, stdio: 'inherit' },
);
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => child.kill(signal));
}
child.on('error', (error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1);
});
