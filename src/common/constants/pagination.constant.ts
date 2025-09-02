export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 10
export const MAX_LIMIT = 100

export const SORT_ORDER = ['ASC', 'DESC'] as const

// [number]: all valid index of SORT_ORDER & create union type
export type SortOrder = (typeof SORT_ORDER)[number]
