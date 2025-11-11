import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Request } from 'express'
import { IErrorDetail, IPrismaError, ITypeORMError } from '@/common/interfaces'
import { ApiResponseBuilder } from '@/common/builders'
import { PrismaErrorCode, TypeORMErrorType } from '@/common/enums'
import { CUSTOM_HEADERS, REQUEST_CONTEXTS } from '@/common/constants'

/**
 * Enterprise-Grade Catch-Everything Exception Filter.
 * This is the LAST LINE OF DEFENSE - catches all exceptions not handled by specific filters.
 *
 * Handles
 * 1. Prisma errors (P2002, P2003, P2025, etc.) - 30+ error codes
 * 2. TypeORM errors (QueryFailedError, EntityNotFoundError, etc.)
 * 3. JavaScript runtime errors (TypeError, ReferenceError, etc.)
 * 4. Third-party library errors
 * 5. Any other unexpected errors
 *
 * Philosophy
 * - Security first: Never expose internal error details to clients
 * - Developer experience: Provide trace ID for debugging
 * - Stability: Always return valid response (never crash)
 * - Consistency: Use standardized IApiResponse format
 *
 * Registration Order (in app.module.ts)
 * - Register generic filter first (executes last - lowest priority)
 * {
 *   provide: APP_FILTER,
 *   useClass: CatchEverythingFilter,
 * },
 *
 * - Register specific filter second (executes first - highest priority)
 * {
 *   provide: APP_FILTER,
 *   useClass: HttpExceptionFilter,
 * }
 */
@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()

    // Extract trace ID for debugging
    const traceId = this.extractTraceId(request)

    // Determine error type and build appropriate response
    let statusCode: number
    let message: string
    let errorDetail: IErrorDetail

    if (this.isPrismaError(exception)) {
      const prismaResponse = this.handlePrismaError(exception)
      statusCode = prismaResponse.statusCode
      message = prismaResponse.message
      errorDetail = prismaResponse.errorDetail
    } else if (this.isTypeORMError(exception)) {
      const typeormResponse = this.handleTypeORMError(exception)
      statusCode = typeormResponse.statusCode
      message = typeormResponse.message
      errorDetail = typeormResponse.errorDetail
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'
      errorDetail = {
        code: 'INTERNAL_SERVER_ERROR',
        validationErrors: null,
      }
    }

    // Build standardized error response
    const errorResponse = ApiResponseBuilder.error(message, errorDetail, traceId)

    // Send response using HttpAdapter (platform-agnostic)
    httpAdapter.reply(ctx.getResponse(), errorResponse, statusCode)
  }

  /**
   * Extract trace ID from the request for debugging purposes.
   * Attempts to extract the trace ID from multiple sources in priority order:
   * 1. x-trace-id header
   * 2. x-request-id header
   * 3. Request property set by middleware
   *
   * @param request - Express request object
   * @returns Trace ID string if found, undefined otherwise
   */
  private extractTraceId(request: Request): string | undefined {
    const traceId =
      request.headers[CUSTOM_HEADERS.TRACE_ID] ||
      request.headers[CUSTOM_HEADERS.REQUEST_ID] ||
      request[REQUEST_CONTEXTS.TRACE_ID]

    if (typeof traceId === 'string' && traceId.trim().length > 0) {
      return traceId.trim()
    }

    if (Array.isArray(traceId) && traceId.length > 0) {
      return traceId.join('_')
    }

    return undefined
  }

  /**
   * Check if an exception is a Prisma error.
   * Validates that the exception is an object containing a 'code' property
   * with a string value starting with 'P', which is the Prisma error code pattern.
   *
   * @param exception - The exception to check
   * @returns Type predicate indicating if the exception is a Prisma error
   */
  private isPrismaError(exception: unknown): exception is IPrismaError {
    if (typeof exception !== 'object' || exception === null) {
      return false
    }

    const err = exception as Record<string, unknown>

    return 'code' in err && typeof err.code === 'string' && err.code.startsWith('P')
  }

  /**
   * Check if an exception is a TypeORM error.
   * Validates that the exception is an object containing a 'name' property matching one of the known TypeORM error types.
   *
   * @param exception - The exception to check
   * @returns Type predicate indicating if the exception is a TypeORM error
   */
  private isTypeORMError(exception: unknown): exception is ITypeORMError {
    if (typeof exception !== 'object' || exception === null || !('name' in exception)) {
      return false
    }

    const err = exception as Record<string, unknown>
    const errorName = err.name

    return typeof errorName === 'string' && Object.values(TypeORMErrorType).includes(errorName as TypeORMErrorType)
  }

  /**
   * Handle Prisma errors and convert to user-friendly responses.
   * Maps Prisma error codes to appropriate HTTP status codes and messages.
   * Extracts metadata for detailed error information while maintaining security.
   *
   * @param exception - Prisma error object containing code, message, and metadata
   * @returns Formatted error response with status code, message, and error details
   */
  private handlePrismaError(exception: IPrismaError): {
    statusCode: number
    message: string
    errorDetail: IErrorDetail
  } {
    const { code, meta } = exception

    // Type assertion for meta to allow property access
    const metadata = meta as Record<string, any> | undefined

    switch (code as PrismaErrorCode) {
      // ================================================================
      // QUERY FAILED
      // ================================================================
      case PrismaErrorCode.UNIQUE_CONSTRAINT: {
        const targetValue = metadata?.target as string | string[] | undefined
        const field =
          targetValue !== undefined && targetValue !== null
            ? Array.isArray(targetValue)
              ? String(targetValue[0])
              : String(targetValue)
            : 'field'
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'A record with this value already exists',
          errorDetail: {
            code: 'CONFLICT',
            validationErrors: null,
            details: { field, constraint: 'unique' },
          },
        }
      }

      case PrismaErrorCode.FOREIGN_KEY_CONSTRAINT: {
        const field = metadata?.field_name ? String(metadata.field_name as string) : 'related field'
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference to related record',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: { field, constraint: 'foreign_key' },
          },
        }
      }

      case PrismaErrorCode.NULL_CONSTRAINT: {
        const field = metadata?.column_name
          ? String(metadata.column_name as string)
          : metadata?.constraint
            ? String(metadata.constraint as string)
            : 'field'
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Field cannot be null',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: { field, constraint: 'not_null' },
          },
        }
      }

      case PrismaErrorCode.CONSTRAINT_FAILED: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Constraint violation',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: { constraint: 'database_constraint' },
          },
        }
      }

      // ================================================================
      // RECORD ERRORS
      // ================================================================
      case PrismaErrorCode.RECORD_NOT_FOUND: {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          errorDetail: {
            code: 'NOT_FOUND',
            validationErrors: null,
            details: (metadata?.cause as string) || 'The requested record does not exist',
          },
        }
      }

      case PrismaErrorCode.DEPENDENT_RECORDS: {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Cannot delete record with dependent records',
          errorDetail: {
            code: 'CONFLICT',
            validationErrors: null,
            details: { constraint: 'dependent_records' },
          },
        }
      }

      case PrismaErrorCode.RELATED_RECORD_NOT_FOUND: {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Related record not found',
          errorDetail: {
            code: 'NOT_FOUND',
            validationErrors: null,
            details: 'A related record does not exist',
          },
        }
      }

      case PrismaErrorCode.REQUIRED_CONNECTED_RECORDS_NOT_FOUND: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Required related record not found',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: (metadata?.cause as string) || 'A required related record does not exist',
          },
        }
      }

      case PrismaErrorCode.RECORDS_NOT_CONNECTED: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Records are not properly connected',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: { constraint: 'connection' },
          },
        }
      }

      case PrismaErrorCode.OPERATION_FAILED_RECORDS_NOT_FOUND: {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Operation failed: required records not found',
          errorDetail: {
            code: 'NOT_FOUND',
            validationErrors: null,
            details: 'One or more required records do not exist',
          },
        }
      }

      // ================================================================
      // VALIDATION ERRORS
      // ================================================================
      case PrismaErrorCode.REQUIRED_FIELD_MISSING: {
        const field = metadata?.field ? String(metadata.field as string) : 'required field'
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Required field is missing',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: { field },
          },
        }
      }

      case PrismaErrorCode.VALUE_TOO_LONG: {
        const field = metadata?.column_name ? String(metadata.column_name as string) : 'field'
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Value too long for field',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: { field, constraint: 'max_length' },
          },
        }
      }

      case PrismaErrorCode.INVALID_VALUE: {
        const field = metadata?.column_name ? String(metadata.column_name as string) : 'field'
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid value provided',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: { field },
          },
        }
      }

      case PrismaErrorCode.VALUE_OUT_OF_RANGE: {
        const field = metadata?.column_name ? String(metadata.column_name as string) : 'field'
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Value out of range',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: { field, constraint: 'range' },
          },
        }
      }

      case PrismaErrorCode.MISSING_REQUIRED_ARGUMENT: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Missing required argument',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: 'A required argument is missing',
          },
        }
      }

      case PrismaErrorCode.INVALID_STORED_VALUE: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Invalid value stored in database',
          errorDetail: {
            code: 'INTERNAL_SERVER_ERROR',
            validationErrors: null,
            details: 'Database contains invalid data',
          },
        }
      }

      // ================================================================
      // SCHEMA ERRORS
      // ================================================================
      case PrismaErrorCode.TABLE_NOT_EXIST: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database schema error',
          errorDetail: {
            code: 'INTERNAL_SERVER_ERROR',
            validationErrors: null,
            details: 'Database table does not exist',
          },
        }
      }

      case PrismaErrorCode.COLUMN_NOT_EXIST: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database schema error',
          errorDetail: {
            code: 'INTERNAL_SERVER_ERROR',
            validationErrors: null,
            details: 'Database column does not exist',
          },
        }
      }

      case PrismaErrorCode.INCONSISTENT_COLUMN_DATA: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Inconsistent column data',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: { constraint: 'data_consistency' },
          },
        }
      }

      case PrismaErrorCode.MODEL_NOT_EXIST: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Model does not exist',
          errorDetail: {
            code: 'INTERNAL_SERVER_ERROR',
            validationErrors: null,
            details: 'The specified model does not exist',
          },
        }
      }

      // ================================================================
      // CONNECTION ERRORS
      // ================================================================
      case PrismaErrorCode.CONNECTION_ERROR:
      case PrismaErrorCode.CONNECTION_TIMEOUT:
      case PrismaErrorCode.DATABASE_NOT_EXIST:
      case PrismaErrorCode.AUTHENTICATION_FAILED:
      case PrismaErrorCode.CONNECTION_CLOSED: {
        return {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Database connection error',
          errorDetail: {
            code: 'SERVICE_UNAVAILABLE',
            validationErrors: null,
            details: 'Unable to connect to database',
          },
        }
      }

      case PrismaErrorCode.CONNECTION_POOL_TIMEOUT: {
        return {
          statusCode: HttpStatus.REQUEST_TIMEOUT,
          message: 'Connection pool timeout',
          errorDetail: {
            code: 'REQUEST_TIMEOUT',
            validationErrors: null,
            details: 'Database connection pool exhausted',
          },
        }
      }

      case PrismaErrorCode.TOO_MANY_CONNECTIONS: {
        return {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Too many database connections',
          errorDetail: {
            code: 'SERVICE_UNAVAILABLE',
            validationErrors: null,
            details: 'Database connection limit reached',
          },
        }
      }

      // ================================================================
      // TIMEOUT ERRORS
      // ================================================================
      case PrismaErrorCode.OPERATION_TIMEOUT: {
        return {
          statusCode: HttpStatus.REQUEST_TIMEOUT,
          message: 'Database operation timeout',
          errorDetail: {
            code: 'REQUEST_TIMEOUT',
            validationErrors: null,
            details: 'The database operation took too long',
          },
        }
      }

      // ================================================================
      // QUERY ERRORS
      // ================================================================
      case PrismaErrorCode.QUERY_VALIDATION_ERROR:
      case PrismaErrorCode.QUERY_PARSING_ERROR:
      case PrismaErrorCode.RAW_QUERY_FAILED:
      case PrismaErrorCode.QUERY_INTERPRETATION_ERROR: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid query',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: 'The database query is invalid',
          },
        }
      }

      case PrismaErrorCode.DATA_VALIDATION_ERROR: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Data validation error',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: 'The provided data failed validation',
          },
        }
      }

      case PrismaErrorCode.INPUT_ERROR: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid input',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: 'The provided input is invalid',
          },
        }
      }

      case PrismaErrorCode.QUERY_PARAMETER_LIMIT_EXCEEDED: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Query parameter limit exceeded',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: 'Too many query parameters provided',
          },
        }
      }

      // ================================================================
      // TRANSACTION ERRORS
      // ================================================================
      case PrismaErrorCode.TRANSACTION_ERROR: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Transaction error',
          errorDetail: {
            code: 'INTERNAL_SERVER_ERROR',
            validationErrors: null,
            details: 'Database transaction failed',
          },
        }
      }

      case PrismaErrorCode.WRITE_CONFLICT: {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Write conflict or deadlock',
          errorDetail: {
            code: 'CONFLICT',
            validationErrors: null,
            details: 'Database write conflict detected',
          },
        }
      }

      // ================================================================
      // MULTIPLE ERRORS
      // ================================================================
      case PrismaErrorCode.MULTIPLE_ERRORS: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Multiple validation errors occurred',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: 'Multiple database errors occurred',
          },
        }
      }

      // ================================================================
      // SECURITY & ACCESS
      // ================================================================
      case PrismaErrorCode.ACCESS_DENIED: {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Access denied',
          errorDetail: {
            code: 'FORBIDDEN',
            validationErrors: null,
            details: 'You do not have permission to access this resource',
          },
        }
      }

      case PrismaErrorCode.TLS_CONNECTION_ERROR: {
        return {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Secure connection error',
          errorDetail: {
            code: 'SERVICE_UNAVAILABLE',
            validationErrors: null,
            details: 'Failed to establish secure database connection',
          },
        }
      }

      // ================================================================
      // UNKNOWN ERRORS
      // ================================================================
      default: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
          errorDetail: {
            code: 'INTERNAL_SERVER_ERROR',
            validationErrors: null,
            details: 'An unexpected database error occurred',
          },
        }
      }
    }
  }

  /**
   * Handle TypeORM errors and convert to user-friendly responses.
   *
   * Maps TypeORM error types to appropriate HTTP status codes and messages.
   * Checks driver error codes for database-specific constraint violations.
   *
   * @param exception - TypeORM error object containing error details
   * @returns Formatted error response with status code, message, and error details
   */
  private handleTypeORMError(exception: ITypeORMError): {
    statusCode: number
    message: string
    errorDetail: IErrorDetail
  } {
    const { name, message, driverError } = exception

    switch (name as TypeORMErrorType) {
      // ================================================================
      // QUERY FAILED
      // ================================================================
      case TypeORMErrorType.QUERY_FAILED: {
        // Check for unique constraint violation
        if (
          message.includes('duplicate key') ||
          message.includes('UNIQUE constraint') ||
          message.includes('Duplicate entry') ||
          (driverError &&
            (driverError.code === 'ER_DUP_ENTRY' || // MySQL
              driverError.code === '23505' || // PostgreSQL
              driverError.code === 'SQLITE_CONSTRAINT')) // SQLite
        ) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: 'A record with this value already exists',
            errorDetail: {
              code: 'CONFLICT',
              validationErrors: null,
              details: { constraint: 'unique' },
            },
          }
        }

        // Check for foreign key constraint violation
        if (
          message.includes('foreign key constraint') ||
          message.includes('FOREIGN KEY constraint') ||
          message.includes('violates foreign key') ||
          (driverError &&
            (driverError.code === 'ER_NO_REFERENCED_ROW' || // MySQL
              driverError.code === 'ER_ROW_IS_REFERENCED' || // MySQL
              driverError.code === '23503')) // PostgreSQL
        ) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid reference to related record',
            errorDetail: {
              code: 'BAD_REQUEST',
              validationErrors: null,
              details: { constraint: 'foreign_key' },
            },
          }
        }

        // Check for NOT NULL constraint violation
        if (
          message.includes('NOT NULL constraint') ||
          message.includes('cannot be null') ||
          message.includes('null value') ||
          (driverError &&
            (driverError.code === 'ER_BAD_NULL_ERROR' || // MySQL
              driverError.code === '23502')) // PostgreSQL
        ) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Required field cannot be null',
            errorDetail: {
              code: 'BAD_REQUEST',
              validationErrors: null,
              details: { constraint: 'not_null' },
            },
          }
        }

        // Check for CHECK constraint violation
        if (
          message.includes('CHECK constraint') ||
          message.includes('check constraint') ||
          (driverError && driverError.code === '23514') // PostgreSQL
        ) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Value does not meet validation requirements',
            errorDetail: {
              code: 'BAD_REQUEST',
              validationErrors: null,
              details: { constraint: 'check' },
            },
          }
        }

        // Generic query failed error
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid query',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: 'The database query failed',
          },
        }
      }

      // ================================================================
      // ENTITY NOT FOUND
      // ================================================================
      case TypeORMErrorType.ENTITY_NOT_FOUND: {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          errorDetail: {
            code: 'NOT_FOUND',
            validationErrors: null,
            details: 'The requested record does not exist',
          },
        }
      }

      // ================================================================
      // CONNECTION ERRORS
      // ================================================================
      case TypeORMErrorType.CONNECTION_NOT_FOUND:
      case TypeORMErrorType.CANNOT_CONNECT: {
        return {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Database connection error',
          errorDetail: {
            code: 'SERVICE_UNAVAILABLE',
            validationErrors: null,
            details: 'Unable to connect to database',
          },
        }
      }

      // ================================================================
      // LOCKING ERRORS
      // ================================================================
      case TypeORMErrorType.OPTIMISTIC_LOCK_VERSION: {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Record has been modified by another user',
          errorDetail: {
            code: 'CONFLICT',
            validationErrors: null,
            details: { constraint: 'optimistic_lock' },
          },
        }
      }

      case TypeORMErrorType.PESSIMISTIC_LOCK:
      case TypeORMErrorType.TRANSACTION_REQUIRED: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Transaction required for this operation',
          errorDetail: {
            code: 'BAD_REQUEST',
            validationErrors: null,
            details: 'This operation must be performed within a transaction',
          },
        }
      }

      // ================================================================
      // UNKNOWN ERRORS
      // ================================================================
      default: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
          errorDetail: {
            code: 'INTERNAL_SERVER_ERROR',
            validationErrors: null,
            details: 'An unexpected database error occurred',
          },
        }
      }
    }
  }
}
