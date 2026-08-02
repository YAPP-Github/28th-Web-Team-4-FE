const TRUTHY_VALUES = new Set(['true', '1', 'on', 'yes']);

export function isMswEnabled() {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  const raw = process.env.NEXT_PUBLIC_MSW_ENABLED;

  if (raw === undefined) {
    return process.env.NODE_ENV === 'development';
  }

  return TRUTHY_VALUES.has(raw.trim().toLowerCase());
}
