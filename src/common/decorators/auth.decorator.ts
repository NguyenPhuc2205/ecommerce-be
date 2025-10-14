import { SetMetadata } from '@nestjs/common'
import { AuthMetadata, AuthStrategy, GUARD_CONDITIONS, GuardCondition } from '@/common/constants'

export const AUTH_STRATEGIES_KEY = 'authStrategies'

export const Auth = (authStrategies: AuthStrategy[], options?: { condition?: GuardCondition }) => {
  const authMetadata: AuthMetadata = {
    authStrategies,
    options: {
      condition: options?.condition ?? GUARD_CONDITIONS.AND,
    },
  }
  return SetMetadata(AUTH_STRATEGIES_KEY, authMetadata)
}
