export const AUTH_STRATEGIES = {
  JWT: 'JWT',
  API_KEY: 'API_KEY',
  NONE: 'NONE',
} as const

export type AuthStrategy = (typeof AUTH_STRATEGIES)[keyof typeof AUTH_STRATEGIES]

export const GUARD_CONDITIONS = {
  AND: 'AND',
  OR: 'OR',
} as const

export type GuardCondition = (typeof GUARD_CONDITIONS)[keyof typeof GUARD_CONDITIONS]

export type AuthMetadata = {
  authStrategies: AuthStrategy[]
  options: { condition: GuardCondition }
}
