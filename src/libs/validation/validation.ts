import type z from 'zod';
import { ZodError } from 'zod';

import { ValidationError } from '../errors/base.error';

export function validateSchema<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.reduce(
        (acc, issue) => {
          const path = issue.path.join('.') || 'root';
          if (!acc[path]) {
            acc[path] = [];
          }
          acc[path].push(issue.message);
          return acc;
        },
        {} as Record<string, string[]>
      );

      throw new ValidationError('Validation failed', fieldErrors);
    }
    throw error;
  }
}

export function validateSafe<T>(schema: z.ZodType<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const formattedErrors = result.error.issues.reduce(
      (acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      },
      {} as Record<string, string>
    );

    return {
      success: false as const,
      errors: formattedErrors,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}
