import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { JwtPayloadFieldType, REQUEST_CURRENT_USER_KEY } from '@/common/constants'
import { IJwtPayload } from '@/common/interfaces'

export const CurrentUser = createParamDecorator((field: JwtPayloadFieldType | undefined, ctx: ExecutionContext) => {
  // Get request object from http context
  const request: Request = ctx.switchToHttp().getRequest<Request>()
  const user: IJwtPayload | undefined = request[REQUEST_CURRENT_USER_KEY]

  // If user is not found, return undefined
  if (!user) return undefined

  // Return specific field or entire user object
  return field ? user[field] : user
})
