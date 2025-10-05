/**
 * Pagination Metadata.
 * Contains information about the current page and total items.
 * - page: current page number (1-indexed)
 * - limit: number of items per page
 * - totalItems: total number of items across all pages
 * - totalPages: total number of pages
 * - hasNextPage: whether there is a next page
 * - hasPreviousPage: whether there is a previous page
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
 * - items: array of items for the current page
 * - pagination: metadata about the pagination state
 */
export interface IPaginatedData<T> {
  /** Array of items for the current page */
  items: T[]

  /** Pagination metadata */
  pagination: IPaginationMetadata
}
