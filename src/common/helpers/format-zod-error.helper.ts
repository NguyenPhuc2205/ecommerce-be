import { IFormattedZodError } from '@/common/interfaces'
import z, { ZodError } from 'zod'

/**
 * Formats a ZodError into a more readable & comprehensive structure.
 * @param error The ZodError to format.
 * @returns An array of formatted Zod errors.
 */
export function formatZodError(error: ZodError): IFormattedZodError[] {
  return error.issues.map((issue: z.core.$ZodIssue) => {
    // Format path - root when using .refine in object level
    const path = issue.path.length > 0 ? issue.path.join('.') : 'root'

    // Get the actual received value
    let value: unknown
    if ('received' in issue) {
      value = issue.received
    } else if ('input' in issue) {
      value = issue.input
    } else {
      value = undefined
    }

    return {
      path,
      message: issue.message,
      code: issue.code,
      value,
    }
  })
}

export function formatZodErrorsToString(error: ZodError): string {
  const formattedZodErrors = formatZodError(error)

  if (formattedZodErrors.length === 0) {
    return 'Validation failed.'
  }

  return formattedZodErrors.map((err) => `${err.path}: ${err.message}`).join('; ')
}
