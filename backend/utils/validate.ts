import { z } from 'zod';
import { AppError } from './AppError';

export const validate = <T>(schema: z.ZodSchema<T>, data: any): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new AppError(`Validation Error: ${errors}`, 400);
  }
  return result.data;
};
