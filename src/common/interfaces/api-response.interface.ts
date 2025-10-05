import { User } from '@prisma/client'
import { IFormattedZodError } from 'src/common/interfaces/zod.interface'

/**
 * Interface representing detailed error information.
 */
export interface IErrorDetail {
  /** Error code for client handling */
  code?: string

  /** Field-level validation errors */
  validationErrors?: IFormattedZodError[]

  /** Additional error details or context */
  details?: unknown
}

/**
 * Standard API Response Interface.
 * Follows enterprise standards with RFC 7807 compliance for errors
 */
export interface IApiResponse<T = any> {
  /** Response status indicator (true / false) */
  success: boolean

  /** Human-readable message providing more details about the response */
  message: string

  /** Response payload - contains actual data or null on error */
  data: T

  /** Error information - only present when success = false */
  errors?: IErrorDetail

  /** Timestamp of the response in ISO 8601 format */
  timestamp: string

  /** Request trace ID (for debugging purposes) */
  traceId?: string
}

const x: IApiResponse<User | null> = {
  message: 'User not found',
  data: null,
  success: false,
  timestamp: new Date().toISOString(),
}
console.log(x)
