import { PAGINATION_DEFAULTS } from '@/common/constants'
import { PaginationRequest } from '@/common/dtos'
import { IPaginationMetadata } from '@/common/interfaces'

/**
 * Calculate pagination metadata for a paginated response.
 *
 * @param page - The current page number.
 * @param limit - The number of items per page.
 * @param totalItems - The total number of items across all pages.
 * @returns The calculated pagination metadata.
 */
export const calculatePaginationMetadata = (
  page: number,
  limit: number,
  totalItems: number,
  isUnlimited?: boolean,
): IPaginationMetadata => {
  if (isUnlimited) {
    return {
      page: PAGINATION_DEFAULTS.PAGE,
      limit: totalItems,
      totalItems,
      totalPages: PAGINATION_DEFAULTS.TOTAL_PAGES,
      hasNextPage: false,
      hasPreviousPage: false,
    }
  }

  const totalPages = Math.ceil(totalItems / limit) || PAGINATION_DEFAULTS.TOTAL_PAGES

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

/**
 * Calculate the offset for database queries based on page and limit.
 *
 * @param page - The current page number.
 * @param limit - The number of items per page.
 * @returns The calculated offset.
 *
 * @example
 * - Page 1, Limit 10 => Skip 0 (index 0-9)
 * - Page 2, Limit 10 => Skip 10 (index 10-19)
 * - Page 3, Limit 10 => Skip 20 (index 20-29)
 */
export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit
}

/**
 * Extract pagination parameters and remaining filters from a query object.
 *
 * @param query - The full query object containing pagination params and filters.
 * @returns An object with separated pagination params and filters.
 */
export const extractPaginationParams = <T>(query: PaginationRequest & T) => {
  const { page, limit, sortBy, sortOrder, search, isUnlimited, ...remainingFilters } = query

  return {
    pagination: { page, limit, sortBy, sortOrder, search, isUnlimited },
    filters: remainingFilters as T,
  }
}
