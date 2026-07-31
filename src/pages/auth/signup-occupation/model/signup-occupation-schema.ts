import { z } from 'zod';

export const signupOccupationSchema = z.object({
  occupation: z.enum([
    'DEVELOPMENT',
    'DESIGN',
    'MARKETING',
    'PLANNING',
    'SALES',
    'DATA',
    'MANAGEMENT',
    'ETC',
  ]),
});
