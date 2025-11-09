import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { IJwtPayload } from '@/common/interfaces'
import { JwtPayloadFieldType, REQUEST_CONTEXTS } from '@/common/constants'

export const CurrentUser = createParamDecorator((field: JwtPayloadFieldType | undefined, ctx: ExecutionContext) => {
  // Get request object from http context
  const request: Request = ctx.switchToHttp().getRequest<Request>()
  const user: IJwtPayload | undefined = request[REQUEST_CONTEXTS.CURRENT_USER]

  // If user is not found, return undefined
  if (!user) return undefined

  // Return specific field or entire user object
  return field ? user[field] : user
})
