import { SetMetadata } from '@nestjs/common'
import { AuthStrategy, GuardCondition } from 'src/common/constants'

export const AUTH_STRATEGIES_KEY = 'authStrategies'

export const Auth = (authStrategies: AuthStrategy[], options: { condition: GuardCondition }) => {
  return SetMetadata(AUTH_STRATEGIES_KEY, { authStrategies, options })
}
