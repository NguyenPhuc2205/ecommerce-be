import { IFormattedZodError } from '@/common/interfaces/zod.interface'

// ================================================================
// GENERAL API RESPONSE INTERFACES
// ================================================================
/**
 * Interface representing detailed error information.
 *
 * @Property code - Optional error code for client handling
 * @Property validationErrors - Field-level validation errors
 * @Property details - Additional error details or context
 * @Property [key: string] - More information about the error
 */
export interface IErrorDetail {
  /** Error code for client handling */
  code?: string

  /** Field-level validation errors */
  validationErrors: IFormattedZodError[] | null

  /** Additional error details or context */
  details?: unknown

  /** More information about the error */
  [key: string]: unknown
}

/**
 * Standard API Response Interface.
 * Follows enterprise standards with RFC 7807 compliance for errors
 *
 * @Property success - Indicates if the request was successful
 * @Property message - Human-readable message about the response
 * @Property data - Actual response payload or null on error
 * @Property errors - Detailed error information when success = false
 * @Property timestamp - ISO 8601 timestamp of the response
 * @Property traceId - Optional request trace ID for debugging
 */
export interface IApiResponse<T = any> {
  /** Response status indicator (true / false) */
  success: boolean

  /** Human-readable message providing more details about the response */
  message: string

  /** Response payload - contains actual data or null on error */
  data: T

  /** Error information - only present when success = false */
  errors?: IErrorDetail | null

  /** Timestamp of the response in ISO 8601 format */
  timestamp: string

  /** Request trace ID (for debugging purposes) */
  traceId?: string
}

// ================================================================
// PAGINATION INTERFACES
// ================================================================
/**
 * Pagination Metadata.
 * Contains information about the current page and total items.
 *
 * @Property page - current page number (1-indexed)
 * @Property limit - number of items per page
 * @Property totalItems - total number of items across all pages
 * @Property totalPages - total number of pages
 * @Property hasNextPage - whether there is a next page
 * @Property hasPreviousPage - whether there is a previous page
 */
export interface IPaginationMetadata {
  /** Current page number (1-indexed) */
  page: number

  /** Number of items per page */
  limit: number

  /** Total number of items across all pages */
  totalItems: number

  /** Total number of pages */
  totalPages: number

  /** Whether there is a next page */
  hasNextPage: boolean

  /** Whether there is a previous page */
  hasPreviousPage: boolean
}

/**
 * Paginated Response Data Structure.
 * Contains items and pagination metadata in data field.
 *
 * @Property items - array of items for the current page
 * @Property pagination -
 *  metadata about the pagination state
 */
export interface IPaginatedData<T> {
  /** Array of items for the current page */
  items: T[]

  /** Pagination metadata */
  pagination: IPaginationMetadata
}
