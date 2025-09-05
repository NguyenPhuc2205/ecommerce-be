import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { REQUEST_CURRENT_USER_KEY } from 'src/common/constants'
import { IJwtPayload } from 'src/common/interfaces'

export const CurrentUser = createParamDecorator((field: keyof IJwtPayload | undefined, ctx: ExecutionContext) => {
  // Get request object from http context
  const request: Request = ctx.switchToHttp().getRequest<Request>()
  const user: IJwtPayload | undefined = request[REQUEST_CURRENT_USER_KEY]

  // If user is not found, return undefined
  if (!user) return undefined

  // If field is specified, return the specific field from user
  if (field) {
    return user[field]
  }

  // If no field is specified, return the entire user object
  return user
})
