import { REQUEST_CURRENT_USER_KEY, TOKEN_TYPES } from '@/common/constants'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '@/common/decorators/is-public.decorator'
import { IJwtPayload } from '@/common/interfaces'
import { TokenService } from '@/shared/token/token.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get metadata isPublic marked as public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // If the route is public, allow access (no jwt auth required)
    if (isPublic) return true

    // If the route is not public, get & verify JWT
    const http: HttpArgumentsHost = context.switchToHttp()
    const request: Request = http.getRequest()

    try {
      // Get access token from request headers
      const accessToken = this.tokenService.extractTokenFromHeader(request)
      if (!accessToken) {
        throw new UnauthorizedException('No access token provided.')
      }

      // Verify JWT and extract payload
      const payload: IJwtPayload = await this.tokenService.verify(TOKEN_TYPES.ACCESS, accessToken)

      // Attach user info to request object for further use (or request.currentUser = payload & define types)
      request[REQUEST_CURRENT_USER_KEY] = payload

      // Continue with the request processing
      return true
    } catch {
      throw new UnauthorizedException('Invalid or expired access token.')
    }
  }
}
