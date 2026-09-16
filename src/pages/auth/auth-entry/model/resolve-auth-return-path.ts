export function resolveAuthReturnPath(value: string | string[] | undefined): string {
  const returnPath = Array.isArray(value) ? value[0] : value;

  if (!returnPath || !returnPath.startsWith('/') || returnPath.startsWith('//')) {
    return '/';
  }

  return returnPath;
}
