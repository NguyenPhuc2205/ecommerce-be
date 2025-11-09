import z from 'zod'
import { createZodDto } from 'nestjs-zod'
import { PAGINATION_DEFAULTS, SORT_ORDER } from '@/common/constants'

/**
 * Base Pagination Request Schema.
 * Standard query parameters for paginated endpoints.
 *
 * Usage Behavior
 * - No params => Default pagination (page=1, limit=10)
 * - Only search => Default pagination + search
 * - Only sortBy => Default pagination + sort (ASC)
 * - page without limit => Use default limit
 * - limit without page => Start from page 1
 * - limit=-1 => Get all (up to MAX_UNLIMITED_ITEMS)
 */
export const BasePaginationRequestSchema = z
  .object({
    /** Page number (1-indexed) */
    page: z.coerce.number().int().min(PAGINATION_DEFAULTS.MIN_PAGE).default(PAGINATION_DEFAULTS.PAGE),

    /** Number of items per page */
    limit: z.coerce
      .number()
      .int()
      .refine(
        (val) =>
          val === PAGINATION_DEFAULTS.UNLIMITED ||
          (val >= PAGINATION_DEFAULTS.MIN_LIMIT && val <= PAGINATION_DEFAULTS.MAX_LIMIT),
      )
      .default(PAGINATION_DEFAULTS.LIMIT),

    /** Field to sort by */
    sortBy: z.string().optional(),

    /** Sort direction (case-sensitive) */
    sortOrder: z
      .preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), z.enum(SORT_ORDER))
      .default('ASC')
      .optional(),

    /** Search query */
    search: z.string().min(1).optional(),
  })
  .transform((data) => {
    if (data.limit === PAGINATION_DEFAULTS.UNLIMITED) {
      return {
        ...data,
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.MAX_UNLIMITED_ITEMS,
      }
    }

    return data
  })

/**
 * Pagination Request Type.
 * Inferred from paginationRequestSchema.
 */
export type PaginationRequest = z.infer<typeof BasePaginationRequestSchema>

/**
 * Pagination Request DTO.
 * Used for validating and transforming incoming pagination query parameters.
 * Usage: @Query() pagination: PaginationRequestDto
 */
export class PaginationRequestDto extends createZodDto(BasePaginationRequestSchema) {}
