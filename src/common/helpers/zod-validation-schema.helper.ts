import z from 'zod'

/**
 * Creates a non-empty string schema with minimum length validation.
 */
export const createNonEmptyStringSchema = (minLength: number = 1): z.ZodString => {
  return z.string().min(minLength).trim()
}

/**
 * Creates a port number schema with range validation.
 */
export const createPortSchema = (min: number = 1000, max: number = 65535): z.ZodCoercedNumber => {
  return z.coerce.number().int().min(min).max(max)
}

/**
 * Creates an email validation schema.
 */
export const createEmailSchema = (minLength: number): z.ZodEmail => {
  return z.email().min(minLength).toLowerCase().trim()
}

/**
 * Creates a URL validation schema.
 */
export const createUrlSchema = (minLength: number, maxLength?: number): z.ZodURL => {
  let schema = z.url().min(minLength)

  if (maxLength) {
    schema = schema.max(maxLength)
  }

  return schema.trim()
}

/**
 * Creates a positive integer schema.
 */
export const createPositiveIntSchema = (): z.ZodCoercedNumber => {
  return z.coerce.number().int().positive()
}

/**
 * Creates a number range schema.
 */
export function createRangeSchema(min: number, max: number): z.ZodCoercedNumber {
  return z.coerce.number().min(min).max(max)
}

/**
 * Creates a comma-separated string to array transformation schema.
 */
export function createStringArraySchema() {
  return z
    .string()
    .transform((value) => {
      // Transform comma-separated string to array
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    })
    .pipe(
      // Result of transform validate in schema within pipe
      z.array(z.string().min(1)),
    )
}

/**
 * Creates a JWT expiration time validation schema.
 */
export function createJwtExpirationSchema(): z.ZodString {
  const JWT_EXPIRE_TIME_REGEX = /^(\d+[smhd])+$/
  return z.string().regex(JWT_EXPIRE_TIME_REGEX, 'Must be in format like "1h", "30m", "7d"')
}

/**
 * Creates a database URL validation schema.
 */
export function createDatabaseUrlSchema(): z.ZodString {
  const DATABASE_URL_REGEX = /^postgresql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^?]+(\?.*)?$/
  return z.string().regex(DATABASE_URL_REGEX, 'Must be a valid PostgreSQL connection string')
}
