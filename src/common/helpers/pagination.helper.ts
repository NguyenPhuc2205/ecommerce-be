import { PAGINATION_DEFAULTS } from 'src/common/constants'
import { IPaginationMetadata } from 'src/common/interfaces/pagination.interface'

export const calculatePaginationMetadata = (page: number, limit: number, totalItems: number): IPaginationMetadata => {
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
 * Example:
 * - Page 1, Limit 10 => Skip 0 (index 0-9)
 * - Page 2, Limit 10 => Skip 10 (index 10-19)
 * - Page 3, Limit 10 => Skip 20 (index 20-29)
 * @param page - The current page number.
 * @param limit - The number of items per page.
 * @returns The calculated offset.
 */
export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit
}
