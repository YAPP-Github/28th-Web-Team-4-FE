import { z } from 'zod';

const apiErrorSchema = z.object({
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .nullish(),
});

export function getApiErrorCode(error: unknown): string | undefined {
  const result = apiErrorSchema.safeParse(error);

  return result.success ? result.data.error?.code : undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const result = apiErrorSchema.safeParse(error);

  return result.success ? (result.data.error?.message ?? fallback) : fallback;
}
