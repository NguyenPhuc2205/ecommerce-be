/**
 * Pagination default values and configuration constants.
 *
 * Provides standardized pagination settings used throughout the application
 * to ensure consistent behavior for paginated API responses. Includes limits
 * for safety and performance optimization.
 *
 * @property {number} MIN_PAGE - Minimum valid page number (1-based indexing)
 * @property {number} PAGE - Default page number when not specified
 * @property {number} LIMIT - Default number of items per page
 * @property {number} MIN_LIMIT - Minimum allowed items per page
 * @property {number} MAX_LIMIT - Maximum allowed items per page (prevents excessive data transfer)
 * @property {number} TOTAL_PAGES - Default total pages value
 * @property {number} TOTAL_ITEMS - Default total items value
 * @property {number} UNLIMITED - Special value indicating "fetch all items" without pagination
 * @property {number} MAX_UNLIMITED_ITEMS - Safety limit for unlimited fetches (prevents memory issues)
 */
export const PAGINATION_DEFAULTS = {
  MIN_PAGE: 1,
  PAGE: 1,

  LIMIT: 10,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,

  TOTAL_PAGES: 1,
  TOTAL_ITEMS: 0,

  /** Special value for 'get all' */
  UNLIMITED: -1,
  MAX_UNLIMITED_ITEMS: 1000,
} as const

export type PaginationDefaultKey = keyof typeof PAGINATION_DEFAULTS

export type PaginationDefault = (typeof PAGINATION_DEFAULTS)[keyof typeof PAGINATION_DEFAULTS] // [...]: all valid index of PAGINATION_DEFAULTS & create union type

/**
 * Sorting directions for ordering query results.
 *
 * Defines the standard sort order options for database queries
 * and API responses. Used in pagination and filtering operations.
 *
 * @property {string} ASC - Ascending order (A-Z, 0-9, oldest to newest)
 * @property {string} DESC - Descending order (Z-A, 9-0, newest to oldest)
 */
export const SORT_ORDER = ['ASC', 'DESC'] as const

export type SortOrderKey = keyof typeof SORT_ORDER

export type SortOrder = (typeof SORT_ORDER)[number] // [number]: all valid index of SORT_ORDER & create union type
