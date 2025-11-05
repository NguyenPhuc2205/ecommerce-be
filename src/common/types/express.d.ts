import { REQUEST_CONTEXTS } from '@/common/constants'
import { IJwtPayload } from '@/common/interfaces'

declare global {
  namespace Express {
    interface Request {
      [REQUEST_CONTEXTS.CURRENT_USER]?: IJwtPayload
      [REQUEST_CONTEXTS.TRACE_ID]: string
    }
  }
}
