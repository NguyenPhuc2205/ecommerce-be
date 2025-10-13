import { CUSTOM_HEADER_KEY } from '@/common/constants'
import { ApiResponseBuilder } from '@/common/helpers'
import { IApiResponse, IErrorDetail } from '@/common/interfaces'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request: Request = ctx.getRequest<Request>()
    const response: Response = ctx.getResponse<Response>()

    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    const traceId = this.extractTraceIdFromHeader(request)

    let message: string
    let errorDetails: IErrorDetail

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse
    }

    const errorResponse = ApiResponseBuilder.error(message, errorDetails, traceId)
    response.status(status).json(errorResponse)
  }

  private extractTraceIdFromHeader(request: Request): string {
    const traceId = request.headers[CUSTOM_HEADER_KEY.TRACE_ID] as string
    return traceId
  }
}
