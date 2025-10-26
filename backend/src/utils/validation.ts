import { z } from 'zod';
import { NextResponse } from 'next/server';

/**
 * Validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with error response or valid data
 */
export function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; response: NextResponse } {
  const validation = schema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors,
        },
        { status: 400 }
      ),
    };
  }

  return {
    success: true,
    data: validation.data,
  };
}

/**
 * Format validation errors for consistent API responses
 */
export function formatValidationErrors(errors: z.ZodError['errors']) {
  return errors.map((error) => ({
    field: error.path.join('.'),
    message: error.message,
  }));
} 