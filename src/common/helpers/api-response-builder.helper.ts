import { calculatePaginationMetadata } from '@/common/helpers/pagination.helper'
import { IApiResponse, IErrorDetail, IPaginatedData, IPaginationMetadata } from '@/common/interfaces'

export class ApiResponseBuilder {
  /**
   * Create a successful response
   *
   * @template T - Type of the response data
   * @param data - Response payload
   * @param message - Success message (default: 'Operation successful')
   * @param traceId - Request trace identifier for debugging
   * @returns Formatted success response
   *
   * @example
   * return ApiResponseBuilder.success(user, 'User retrieved successfully')
   *
   * @example
   * return ApiResponseBuilder.success(null, 'User deleted successfully')
   */
  static success<T>(data: T, message: string = 'Operation successful', traceId?: string): IApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(), // ISO 8601 format (UTC)
      ...(traceId && { traceId }), // Include traceId only if provided (truthy value)
    }
  }

  /**
   * Create an error response
   *
   * @param message - Human-readable error message
   * @param errors - Error details including code, validationErrors, etc.
   * @param traceId - Request trace identifier for debugging
   * @returns Formatted error response
   *
   * @example
   * return ApiResponseBuilder.error('User not found', { code: 'USER_NOT_FOUND' })
   *
   * @example
   * return ApiResponseBuilder.error('Invalid input', {
   *   code: 'VALIDATION_FAILED',
   *   details: 'Email format is invalid'
   * })
   *
   * @example
   * return ApiResponseBuilder.error('Validation failed', {
   *   code: 'VALIDATION_FAILED',
   *   validationErrors: [
   *     { path: 'email', message: 'Invalid email', code: 'invalid_string' },
   *     { path: 'password', message: 'Too short', code: 'too_small' }
   *   ]
   * })
   *
   * @example
   * return ApiResponseBuilder.error('Cannot delete admin', {
   *   code: 'BUSINESS_RULE_VIOLATION',
   *   details: 'Last admin cannot be deleted',
   *   metadata: { userId: id, role: 'ADMIN' }
   * })
   */
  static error(
    message: string = 'Operation failed',
    errors: IErrorDetail | null,
    traceId?: string,
  ): IApiResponse<null> {
    return {
      success: false,
      message,
      data: null,
      errors,
      timestamp: new Date().toISOString(), // ISO 8601 format (UTC)
      ...(traceId && { traceId }), // Include traceId only if provided (truthy value)
    }
  }

  /**
   * Create a paginated success response
   * Automatically calculates pagination metadata
   *
   * @template T - Type of items in the paginated response
   * @param items - Array of items for current page
   * @param totalItems - Total number of items across all pages
   * @param page - Current page number
   * @param limit - Number of items per page
   * @param message - Success message (default: 'Data retrieved successfully')
   * @param traceId - Request trace identifier for debugging
   * @returns Formatted paginated success response
   *
   * @example
   * const [items, total] = await Promise.all([
   *   this.service.findMany({ skip, take: limit }),
   *   this.service.count()
   * ])
   *
   * return ApiResponseBuilder.paginated(items, page, limit, total)
   */
  static paginated<T>(
    items: T[],
    totalItems: number,
    page: number,
    limit: number,
    message: string = 'Data retrieved successfully',
    traceId?: string,
  ): IApiResponse<IPaginatedData<T>> {
    const pagination: IPaginationMetadata = calculatePaginationMetadata(page, limit, totalItems)
    return {
      success: true,
      message,
      data: {
        items,
        pagination,
      },
      timestamp: new Date().toISOString(), // ISO 8601 format (UTC)
      ...(traceId && { traceId }), // Include traceId only if provided (truthy value)
    }
  }
}
