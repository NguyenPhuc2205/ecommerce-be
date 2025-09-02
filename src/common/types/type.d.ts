import { REQUEST_CURRENT_USER_KEY } from 'src/common/constants'
import { IJwtPayload } from 'src/common/interfaces'

declare global {
  namespace Express {
    interface Request {
      [REQUEST_CURRENT_USER_KEY]?: IJwtPayload
    }
  }
}
