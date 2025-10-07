import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Request } from 'express'
import { map, Observable } from 'rxjs'
import { ApiResponseBuilder } from '@/common/helpers'
import { IApiResponse } from '@/common/interfaces'

/**
 * Global Response Transform Interceptor
 *
 * Wraps all successful controller responses 'T' into standardized 'IApiResponse' format.
 * Works in conjunction with ZodSerializerInterceptor to ensure data is validated and serialized before being wrapped.
 *
 * Execution Order:
 * 1. ZodSerializerInterceptor validates/serializes response data
 * 2. ResponseTransformInterceptor wraps it in standard format
 *
 * @example
 * ```json
 * {
 *   "success": true,
 *   "message": "Operation successful",
 *   "data": { "id": 1, "name": "PuckluvPerfume" },
 *   "timestamp": "2025-10-05T10:30:00.000Z",
 *   "traceId": "req-123-456"
 * }
 * ```
 */
@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IApiResponse<T>> {
    const httpContext: HttpArgumentsHost = context.switchToHttp()
    const request = httpContext.getRequest<Request>()
    const traceId = request.headers['x-trace-id'] as string | undefined

    return next.handle().pipe(
      map((controllerResponse) => {
        // If response is already wrapped in IApiResponse, return as is (Formatted)
        if (this.isApiResponse(controllerResponse)) return controllerResponse as IApiResponse<T>

        // Extract message and data from controller response
        const message = this.extractMessage(controllerResponse)
        const responseData = this.extractData(controllerResponse)

        // Wrap in standard API response format
        return ApiResponseBuilder.success<T>(responseData, message, traceId)
      }),
    )
  }

  /**
   * Check if response is already in IApiResponse format
   */
  private isApiResponse(controllerResponse: unknown): controllerResponse is IApiResponse {
    return (
      typeof controllerResponse === 'object' &&
      controllerResponse !== null &&
      'success' in controllerResponse &&
      'message' in controllerResponse &&
      'data' in controllerResponse &&
      'timestamp' in controllerResponse
    )
  }

  /**
   * Extract custom message from controller response
   * Supports pattern: { message: string, data: T }
   */
  private extractMessage(controllerResponse: unknown): string {
    if (
      controllerResponse &&
      typeof controllerResponse === 'object' &&
      'message' in controllerResponse &&
      typeof controllerResponse.message === 'string'
    ) {
      return controllerResponse.message
    }

    return 'Operation successful'
  }

  /**
   * Extract actual payload from controller response
   * Supports patterns:
   * 1. { message: string, data: T } -> returns T
   * 2. T -> returns T (as-is)
   */
  private extractData(controllerResponse: unknown): T {
    if (controllerResponse && typeof controllerResponse === 'object' && 'data' in controllerResponse) {
      return controllerResponse.data as T
    }

    return controllerResponse as T
  }
}
