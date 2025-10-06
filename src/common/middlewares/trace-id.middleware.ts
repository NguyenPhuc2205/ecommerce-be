import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { CUSTOM_HEADER_KEY, TRACE_ID_KEY } from 'src/common/constants'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerKey = CUSTOM_HEADER_KEY.TRACE_ID
    const traceIdKey = TRACE_ID_KEY

    // Extract from headers or generate a new trace id
    const traceId = (req.headers[headerKey] as string | undefined) ?? uuidv4()

    // Attach trace id to request object for further use in the request lifecycle
    req[traceIdKey] = traceId

    // Also set the trace id in the response headers for client reference
    res.setHeader(headerKey, traceId)

    // Call the next middleware in the chain
    next()
  }
}
