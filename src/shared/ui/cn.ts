import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({ extend: {} });

export const cn = (...inputs: ClassValue[]) => {
  return customTwMerge(clsx(...inputs));
};
