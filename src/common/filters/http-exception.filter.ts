import { CUSTOM_HEADER_KEY, TRACE_ID_KEY } from '@/common/constants'
import { ApiResponseBuilder } from '@/common/helpers'
import { IApiResponse, IErrorDetail, IFormattedZodError } from '@/common/interfaces'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { HttpAdapterHost } from '@nestjs/core'
import { Request, Response } from 'express'

/**
 * Global HTTP Exception Filter
 * Catches all HttpExceptions and formats the response.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly DEFAULT_ERROR_CODE: string = 'UNKNOWN_ERROR'
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx: HttpArgumentsHost = host.switchToHttp()
    const request: Request = ctx.getRequest<Request>()
    const response: Response = ctx.getResponse<Response>()

    const statusCode: number = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    // Extract trace ID
    const traceId = this.extractTraceId(request)

    // Extract message
    const message = this.extractMessage(exceptionResponse, statusCode)

    // Extract validation errors
    const validationErrors = this.extractValidationErrors(exceptionResponse)

    // Build error details
    const errorDetail: IErrorDetail = {
      code: this.generateErrorCode(statusCode),
      validationErrors,
    }

    const errorResponse: IApiResponse<null> = ApiResponseBuilder.error(message, errorDetail, traceId)
    httpAdapter.reply(response, errorResponse, statusCode)
  }

  /**
   * Extract trace ID from request.
   * Supports multiple sources with priority order:
   * 1. x-trace-id header (CUSTOM_HEADER_KEY.TRACE_ID)
   * 2. x-request-id header (CUSTOM_HEADER_KEY.REQUEST_ID)
   * 3. Request property (TRACE_ID_KEY) - set by middleware
   *
   * @param request Express request object
   * @returns Trace ID string or undefined if not found
   */
  private extractTraceId(request: Request): string | undefined {
    const traceId =
      request.headers[CUSTOM_HEADER_KEY.TRACE_ID] ||
      request.headers[CUSTOM_HEADER_KEY.REQUEST_ID] ||
      request[TRACE_ID_KEY]

    if (typeof traceId === 'string' && traceId.trim().length > 0) {
      return traceId.trim()
    }

    if (Array.isArray(traceId) && traceId.length > 0) {
      const mergedTraceId = traceId.join('_')
      return mergedTraceId
    }

    return undefined
  }

  /**
   * Generate standardized error code from HTTP status.
   * @param status HTTP status code
   * @returns Standardized error code string
   */
  private generateErrorCode(status: number): string {
    const statusKey = HttpStatus[status]

    if (!statusKey) {
      return this.DEFAULT_ERROR_CODE
    }

    return statusKey
      .replace(/([a-z])([A-Z])/g, '$1_$2') // Convert camelCase to snake_case
      .toUpperCase()
  }

  private extractMessage(exceptionResponse: string | object, statusCode: number): string {
    // Response is a string
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse
    }

    // Response is an object with a 'message' property (null is also object)
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
      const msg = exceptionResponse.message

      // Non-empty string message
      if (typeof msg === 'string' && msg.trim().length > 0) {
        return msg.trim()
      }

      // Array of messages, join with separator
      if (Array.isArray(msg) && msg.length > 0) {
        return msg.map((m) => (typeof m === 'string' ? m : JSON.stringify(m))).join('. ')
      }
    }

    // Fallback to default message for status code
    return this.getDefaultMessageForStatus(statusCode)
  }

  /**
   * Extract validation errors from exception response.
   * Supports Zod validation errors and custom validation error formats.
   * @param exceptionResponse Exception response object
   * @returns Array of formatted validation errors or null
   */
  private extractValidationErrors(exceptionResponse: string | object): IFormattedZodError[] | null {
    // If response is not an object, return null
    if (typeof exceptionResponse !== 'object' || exceptionResponse === null) return null

    const response = exceptionResponse

    if ('validationErrors' in response && Array.isArray(response.validationErrors)) {
      return this.formatValidationErrors(response.validationErrors)
    }

    return null
  }

  /**
   * Format validation errors into standardized structure.
   * Handles both Zod errors and custom validation error formats.
   * @param errors Array of validation errors
   * @returns Array of formatted validation errors
   */
  private formatValidationErrors(errors: unknown[]): IFormattedZodError[] {
    return errors
      .map((error) => {
        // Skip non-object or null values
        if (typeof error !== 'object' || error === null) return null

        const errorObj = error as Record<string, unknown>

        // Extract path (field name or nested path)
        let path: string = 'root'
        if ('path' in errorObj) {
          if (typeof errorObj.path === 'string' && errorObj.path.trim().length > 0) {
            path = errorObj.path.trim()
          } else if (Array.isArray(errorObj.path) && errorObj.path.length > 0) {
            path = errorObj.path.join('.')
          }
        }

        // Extract message (human-readable error description)
        const message =
          typeof errorObj.message === 'string' && errorObj.message.trim().length > 0
            ? errorObj.message.trim()
            : 'Validation error'

        // Extract code (Zod error code or custom code)
        const code =
          typeof errorObj.code === 'string' && errorObj.code.trim().length > 0
            ? errorObj.code.trim()
            : 'validation_error'

        // Extract value if exists (optional - the invalid value that caused the error)
        const value = 'value' in errorObj ? errorObj.value : undefined

        return {
          path,
          message,
          code,
          value,
        } as IFormattedZodError
      })
      .filter((error): error is IFormattedZodError => error !== null) // Filter out nulls
  }

  /**
   * Get default message for common HTTP status codes.
   * @param statusCode HTTP status code
   * @returns Default error message string
   */
  private getDefaultMessageForStatus(statusCode: number): string {
    const statusMessages: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.PAYMENT_REQUIRED]: 'Payment required',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Resource not found',
      [HttpStatus.METHOD_NOT_ALLOWED]: 'Method not allowed',
      [HttpStatus.NOT_ACCEPTABLE]: 'Not acceptable',
      [HttpStatus.REQUEST_TIMEOUT]: 'Request timeout',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.GONE]: 'Gone',
      [HttpStatus.PAYLOAD_TOO_LARGE]: 'Payload too large',
      [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported media type',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable entity',
      [HttpStatus.TOO_MANY_REQUESTS]: 'Too many requests',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',
      [HttpStatus.NOT_IMPLEMENTED]: 'Not implemented',
      [HttpStatus.BAD_GATEWAY]: 'Bad gateway',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'Service unavailable',
      [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway timeout',
    }

    return statusMessages[statusCode] || 'An error occurred'
  }
}
