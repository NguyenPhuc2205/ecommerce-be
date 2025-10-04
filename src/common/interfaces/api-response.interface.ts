import { IFormattedZodError } from 'src/common/interfaces/zod.interface'

/**
 * Interface representing detailed error information.
 */
export interface IErrorDetail {
  validationErrors?: IFormattedZodError[]
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
  data: T | null

  /** Error information - only present when success = false */
  errors?: IErrorDetail

  /** Timestamp of the response in ISO 8601 format */
  timestamp: string

  /** Request trace ID (for debugging purposes) */
  traceId?: string
}
