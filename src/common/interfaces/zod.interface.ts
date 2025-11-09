/**
 * Interface representing a formatted Zod error.
 * ZodIssue objects are transformed into this structure (except some properties) for easier consumption.
 */
export interface IFormattedZodError {
  /** Path to the invalid field ('email', 'user.name',...) */
  path: string

  /** Error message */
  message: string

  /** Zod issue code */
  code: string

  /** The invalid value */
  value?: unknown
}
