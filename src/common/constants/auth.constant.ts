export const REQUEST_CURRENT_USER_KEY = 'currentUser' as const

export const AUTH_STRATEGIES = {
  JWT: 'jwt',
  API_KEY: 'api_key',
  NONE: 'none',
} as const

export type AuthStrategy = (typeof AUTH_STRATEGIES)[keyof typeof AUTH_STRATEGIES]

export const GUARD_CONDITIONS = {
  AND: 'and',
  OR: 'or',
} as const

export type GuardCondition = (typeof GUARD_CONDITIONS)[keyof typeof GUARD_CONDITIONS]

export type AuthMetadata = {
  authStrategies: AuthStrategy[]
  options: { condition: GuardCondition }
}
