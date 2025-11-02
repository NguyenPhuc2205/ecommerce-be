/**
 * Pagination configuration constants.
 *
 * @module PaginationConstants
 */
/**
 * Pagination default values and types.
 *
 * @property MIN_PAGE - Minimum page number.
 * @property PAGE - Default page number.
 * @property LIMIT - Default items per page limit.
 * @property MIN_LIMIT - Minimum items per page limit.
 * @property MAX_LIMIT - Maximum items per page limit.
 * @property TOTAL_PAGES - Default total pages.
 * @property TOTAL_ITEMS - Default total items.
 *
 */
export const PAGINATION_DEFAULTS = {
  MIN_PAGE: 1,
  PAGE: 1,

  LIMIT: 10,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,

  TOTAL_PAGES: 1,
  TOTAL_ITEMS: 0,
} as const

export type PaginationDefaultKey = keyof typeof PAGINATION_DEFAULTS

export type PaginationDefault = (typeof PAGINATION_DEFAULTS)[keyof typeof PAGINATION_DEFAULTS] // [...]: all valid index of PAGINATION_DEFAULTS & create union type

/**
 * Sorting directions.
 *
 * @property ASC - Ascending order.
 * @property DESC - Descending order.
 *
 */
export const SORT_ORDER = ['ASC', 'DESC'] as const

export type SortOrderKey = keyof typeof SORT_ORDER

export type SortOrder = (typeof SORT_ORDER)[number] // [number]: all valid index of SORT_ORDER & create union type
