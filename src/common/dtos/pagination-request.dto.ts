import z from 'zod'
import { createZodDto } from 'nestjs-zod'
import { PAGINATION_DEFAULTS, SORT_ORDER } from '@/common/constants'

/**
 * Pagination Request Schema.
 * Standard query parameters for paginated endpoints.
 */
export const paginationRequestSchema = z.object({
  /** Page number (1-indexed) */
  page: z.number().int().min(PAGINATION_DEFAULTS.MIN_PAGE).default(PAGINATION_DEFAULTS.PAGE).optional(),

  /** Number of items per page */
  limit: z
    .number()
    .int()
    .min(PAGINATION_DEFAULTS.MIN_LIMIT)
    .max(PAGINATION_DEFAULTS.MAX_LIMIT)
    .default(PAGINATION_DEFAULTS.LIMIT)
    .optional(),

  /** Field to sort by */
  sortBy: z.string().optional(),

  /** Sort direction */
  sortOrder: z.enum(SORT_ORDER).default('ASC').optional(),

  /** Search query */
  search: z.string().min(1).optional(),
})

/**
 * Pagination Request Type.
 * Inferred from paginationRequestSchema.
 */
export type PaginationRequest = z.infer<typeof paginationRequestSchema>

/**
 * Pagination Request DTO.
 * Used for validating and transforming incoming pagination query parameters.
 * Usage: @Query() pagination: PaginationRequestDto
 */
export class PaginationRequestDto extends createZodDto(paginationRequestSchema) {}
