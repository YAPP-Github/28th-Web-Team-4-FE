import { z } from 'zod';

const apiErrorSchema = z.object({
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .nullish(),
});

const apiErrorStatusSchema = z.object({
  status: z.number().int(),
});

export function getApiErrorStatus(error: unknown): number | undefined {
  const result = apiErrorStatusSchema.safeParse(error);

  return result.success ? result.data.status : undefined;
}

export function getApiErrorCode(error: unknown): string | undefined {
  const result = apiErrorSchema.safeParse(error);

  return result.success ? result.data.error?.code : undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const result = apiErrorSchema.safeParse(error);

  return result.success ? (result.data.error?.message ?? fallback) : fallback;
}
