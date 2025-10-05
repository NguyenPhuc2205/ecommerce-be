/**
 * Pagination default values and types
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

/**
 * Sorting directions
 */
export const SORT_ORDER = ['ASC', 'DESC'] as const

/**
 * Sorting direction type.
 * [number]: all valid index of SORT_ORDER & create union type
 */
export type SortOrder = (typeof SORT_ORDER)[number]
