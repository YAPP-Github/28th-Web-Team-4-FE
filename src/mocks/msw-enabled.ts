const TRUTHY_VALUES = new Set(['true', '1', 'on', 'yes']);

export function isMswEnabled() {
  const raw = process.env.NEXT_PUBLIC_MSW_ENABLED;

  // 환경변수가 정의되지 않았으면 기본값은 "켜짐"
  if (raw === undefined) {
    return true;
  }

  return TRUTHY_VALUES.has(raw.trim().toLowerCase());
}
