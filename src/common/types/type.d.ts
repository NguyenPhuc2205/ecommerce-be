import { REQUEST_CURRENT_USER_KEY, TRACE_ID_KEY } from '@/common/constants'
import { IJwtPayload } from '@/common/interfaces'

declare global {
  namespace Express {
    interface Request {
      [REQUEST_CURRENT_USER_KEY]?: IJwtPayload
      [TRACE_ID_KEY]: string
    }
  }
}
