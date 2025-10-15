import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Request } from 'express'
import { map, Observable } from 'rxjs'
import { ApiResponseBuilder } from '@/common/helpers'
import { IApiResponse } from '@/common/interfaces'
import { CUSTOM_HEADER_KEY, TRACE_ID_KEY } from '@/common/constants'

/**
 * Global Response Transform Interceptor.
 *
 * Wraps all successful controller responses 'T' into standardized 'IApiResponse' format.
 * Works in conjunction with ZodSerializerInterceptor to ensure data is validated and serialized before being wrapped.
 *
 * Execution Order:
 * 1. ZodSerializerInterceptor validates/serializes response data
 * 2. ResponseTransformInterceptor wraps it in standard format
 *
 * Supported Controller Response Patterns:
 * 1. Controller return full ApiResponse<T> - returned as-is
 * 2. Controller return { message: string, data: T } - wrapped with custom message
 * 3. Controller return { data: T } - wrapped with default success message
 * 4. Controller return raw T - wrapped with default success message
 *
 * @example
 * ```json
 * {
 *   "success": true,
 *   "message": "Operation successful",
 *   "data": { "id": 1, "name": "Puck luv Perfume" },
 *   "timestamp": "2025-10-11T10:30:00.000Z",
 *   "traceId": "req-abc-123"
 * }
 * ```
 */
@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IApiResponse<T>> {
    const httpContext: HttpArgumentsHost = context.switchToHttp()
    const request = httpContext.getRequest<Request>()
    const traceId = this.extractTraceId(request)

    return next.handle().pipe(
      map((controllerResponse: T) => {
        /**
         * Valid IApiResponse - return as-is.
         */
        if (this.isApiResponse(controllerResponse)) {
          return this.ensureCompleteApiResponse(controllerResponse, traceId)
        }

        /**
         * Partial Response Patterns.
         * - { message, data } (exactly 2 keys)
         * - { data } (exactly 1 key)
         */
        if (this.hasExactMessageAndDataKeys(controllerResponse) || this.hasDataKeyOnly(controllerResponse)) {
          const data = this.extractData(controllerResponse)
          const message = this.extractMessage(controllerResponse)
          return ApiResponseBuilder.success<T>(data, message, traceId)
        }

        /**
         * Raw Response (Fallback).
         * Wrap anything else as-is (objects, arrays, primitives, null, undefined)
         */
        const message = this.extractMessage(controllerResponse)
        return ApiResponseBuilder.success<T>(controllerResponse, message, traceId)
      }),
    )
  }

  /**
   * Extract trace ID from request headers.
   * Supports multiple header formats with priority order:
   * 1. x-trace-id (CUSTOM_HEADER_KEY.TRACE_ID)
   * 2. x-request-id (CUSTOM_HEADER_KEY.REQUEST_ID)
   *
   * @param request Express request object containing HTTP headers
   * @returns Trace ID string (trimmed) or undefined if not found/invalid
   *
   */
  private extractTraceId(request: Request): string | undefined {
    const traceId =
      request.headers[CUSTOM_HEADER_KEY.TRACE_ID] ||
      request.headers[CUSTOM_HEADER_KEY.REQUEST_ID] ||
      request[TRACE_ID_KEY]

    if (typeof traceId === 'string' && traceId.trim().length > 0) {
      return traceId.trim()
    }

    if (Array.isArray(traceId)) {
      const mergedTraceId = traceId.join('_')
      return mergedTraceId
    }

    return undefined
  }

  /**
   * Type guard to check if response is already IApiResponse.
   * Validation Rules (all must pass):
   * 1. Must be an object (not null, undefined, primitive)
   * 2. Must have all required fields: success, message, data, timestamp
   * 3. success must be boolean type
   * 4. message must be non-empty string
   * 5. timestamp must be valid ISO 8601 format string
   * 6. data can be any type (objects, arrays, primitives, null, undefined)
   * Optional fields: errors, traceId (validated if present)
   *
   * @param response Controller response to validate
   * @returns True if response is a valid complete IApiResponse, false otherwise
   */
  private isApiResponse(response: unknown): response is IApiResponse<T> {
    // Must be an object
    if (!response || typeof response !== 'object') return false

    // Must have all required fields
    if (!('success' in response) || !('message' in response) || !('data' in response) || !('timestamp' in response))
      return false

    // Validate success is boolean
    if (typeof response.success !== 'boolean') return false

    // Validate message is non-empty string
    if (typeof response.message !== 'string' || response.message.trim().length === 0) {
      return false
    }

    // Validate timestamp is string & valid ISO 8601 format
    if (typeof response.timestamp !== 'string') return false
    const date = new Date(response.timestamp)
    if (isNaN(date.getTime()) || date.toISOString() !== response.timestamp) return false

    return true
  }

  /**
   * Ensure IApiResponse has traceId if available.
   *
   * @param response Valid IApiResponse to enhance
   * @param traceId Optional traceId extracted from request headers
   * @returns IApiResponse with traceId ensured
   */
  private ensureCompleteApiResponse(response: IApiResponse<T>, traceId?: string): IApiResponse<T> {
    // Already has traceId - keep original
    if (response.traceId) return response

    // Add traceId if available from headers
    if (traceId) {
      return { ...response, traceId }
    }

    // No traceId to add
    return response
  }

  /**
   * Extract custom message from controller response.
   *
   * @param response Unknown controller response object
   * @returns Custom message string (always non-empty)
   */
  private extractMessage(response: unknown): string {
    if (response && typeof response === 'object' && 'message' in response) {
      const messageValue = (response as Record<string, unknown>).message

      // Must be non-empty string
      if (typeof messageValue === 'string' && messageValue.trim().length > 0) {
        return messageValue.trim()
      }
    }

    return 'Operation successful'
  }

  /**
   * Extract actual payload from controller response.
   * Supports patterns:
   * 1. { message: string, data: T } -> returns T
   * 2. T -> returns T (as-is)
   * @param response Unknown controller response object
   * @returns Extracted data payload of type T
   */
  private extractData(response: unknown): T {
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data as T
    }

    return response as T
  }

  /**
   * Check if response has exactly { message, data } pattern.
   * Validation Rules (all must pass):
   * 1. Must be an object (not null, undefined, primitive)
   * 2. Must have exactly 2 keys: 'message' and 'data'
   * 3. Message must be non-empty string
   * 4. No extra fields allowed (prevents data loss)
   *
   * @param response Unknown response from controller
   * @returns True if matches exact { message, data } pattern
   */
  private hasExactMessageAndDataKeys(response: unknown): boolean {
    // Must be an object
    if (!response || typeof response !== 'object') return false

    // Must have exactly 2 keys
    const keys = Object.keys(response)
    if (keys.length !== 2) return false

    // Must have "message" and "data" keys
    if (!('message' in response) || !('data' in response)) return false

    // Message must be non-empty string
    if (typeof response.message !== 'string' || response.message.trim().length === 0) return false

    return true
  }

  /**
   * Check if response has exactly { data } pattern.
   * Validation Rules:
   * 1. Must be an object
   * 2. Must have exactly 1 key: "data"
   * 3. No other fields allowed (prevents data loss)
   *
   * @param response Unknown response from controller
   * @returns True if matches exact { data } pattern
   */
  private hasDataKeyOnly(response: unknown): boolean {
    // Must be an object
    if (!response || typeof response !== 'object') {
      return false
    }

    // Must have exactly 1 key and it must be 'data'
    const keys = Object.keys(response)
    return keys.length === 1 && 'data' in response
  }
}
