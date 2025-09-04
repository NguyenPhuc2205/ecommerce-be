import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_STRATEGIES, AuthMetadata, AuthStrategy, GUARD_CONDITIONS } from 'src/common/constants'
import { AUTH_STRATEGIES_KEY } from 'src/common/decorators'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { XApiKeyGuard } from 'src/common/guards/x-api-key.guard'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly DEFAULT_AUTH_METADATA: AuthMetadata = {
    authStrategies: [AUTH_STRATEGIES.NONE],
    options: { condition: GUARD_CONDITIONS.AND },
  }

  constructor(
    private reflector: Reflector,
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly xApiKeyGuard: XApiKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get auth metadata from @Auth() decorator
    const authMetadata =
      this.reflector.getAllAndOverride<AuthMetadata | undefined>(AUTH_STRATEGIES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? this.DEFAULT_AUTH_METADATA

    console.log('[Debug] authStrategies: ', authMetadata)

    // Get all guards from auth strategies
    const guards: CanActivate[] = authMetadata.authStrategies.map((strategy: AuthStrategy) => {
      return this.createGuard(strategy)
    })

    // Handle guard conditions (AND / OR)
    if (authMetadata.options.condition === GUARD_CONDITIONS.OR) {
      return this.executeOrCondition(guards, context)
    }

    if (authMetadata.options.condition === GUARD_CONDITIONS.AND) {
      return this.executeAndCondition(guards, context)
    }

    throw new Error(`Unsupported guard condition: ${authMetadata.options.condition as string}.`)
  }

  /**
   * Create a guard based on the authentication strategy
   * @param strategy Authentication strategy
   * @returns CanActivate guard instance
   */
  private createGuard(strategy: AuthStrategy): CanActivate {
    switch (strategy) {
      case AUTH_STRATEGIES.JWT:
        return this.jwtAuthGuard
      case AUTH_STRATEGIES.API_KEY:
        return this.xApiKeyGuard
      case AUTH_STRATEGIES.NONE:
        return { canActivate: () => true }
    }
  }

  /**
   * Execute OR condition for guards
   * - If any guards passed, authentication is successful and return true immediately.
   * - If a guard fails, use Promise & Catch error and continue to the next guard.
   * - If all guards failed, throw the last error.
   *
   * @param guards  Array of guard instances
   * @param context Execution context
   * @returns Promise resolving to boolean
   */
  private async executeOrCondition(guards: CanActivate[], context: ExecutionContext): Promise<boolean> {
    let lastError = new UnauthorizedException('Authentication failed.')

    for (const guard of guards) {
      try {
        const canActive = await Promise.resolve(guard.canActivate(context))
        if (canActive) return true
      } catch (error) {
        // Promise rejects, capture the error & go on the next guard
        lastError = error instanceof UnauthorizedException ? error : new UnauthorizedException('Authentication failed.')
      }
    }

    // All guards failed, throw the last error
    throw lastError
  }

  /**
   * Execute AND condition for guards
   * - If all guards passed, authentication is successful.
   * - If a guard fails, throw the error immediately.
   *
   * @param guards Array of guard instances
   * @param context Execution context
   * @returns Promise resolving to boolean
   */
  private async executeAndCondition(guards: CanActivate[], context: ExecutionContext): Promise<boolean> {
    for (const guard of guards) {
      try {
        const canActive = await Promise.resolve(guard.canActivate(context))
        if (!canActive) {
          throw new UnauthorizedException('Authentication failed.')
        }
      } catch (error) {
        // Re-throw the error, converting non-auth errors to UnauthorizedException
        throw error instanceof UnauthorizedException ? error : new UnauthorizedException('Authentication failed.')
      }
    }

    return true
  }
}
