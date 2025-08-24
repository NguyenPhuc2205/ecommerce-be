import { CanActivate, ExecutionContext } from '@nestjs/common'

export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    console.log('JwtAuthGuard: canActivate called', context)
    throw new Error('Method not implemented.')
  }
}
