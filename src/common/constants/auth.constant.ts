// ================================================================
// AUTHENTICATION SECTIONS
// ================================================================
/**
 * Authentication strategies.
 *
 * @property JWT - JSON Web Token authentication strategy.
 * @property API_KEY - API Key authentication strategy.
 * @property NONE - No authentication strategy.
 */
export const AUTH_STRATEGIES = {
  JWT: 'JWT',
  API_KEY: 'API_KEY',
  NONE: 'NONE',
} as const

export type AuthStrategyKey = keyof typeof AUTH_STRATEGIES

export type AuthStrategy = (typeof AUTH_STRATEGIES)[keyof typeof AUTH_STRATEGIES]

/**
 * Guard conditions for combining multiple authentication strategies.
 *
 * @property AND - All strategies must succeed.
 * @property OR - At least one strategy must succeed.
 */
export const GUARD_CONDITIONS = {
  AND: 'AND',
  OR: 'OR',
} as const

export type GuardConditionKey = keyof typeof GUARD_CONDITIONS

export type GuardCondition = (typeof GUARD_CONDITIONS)[keyof typeof GUARD_CONDITIONS]

/**
 * Authentication metadata structure type.
 *
 * @property authStrategies - Array of authentication strategies to be applied.
 * @property options - Additional options for authentication.
 * @property options.condition - Condition to combine multiple strategies (AND/OR).
 */
export type AuthMetadata = {
  authStrategies: AuthStrategy[]
  options: { condition: GuardCondition }
}

// ================================================================
// AUTHORIZATION SECTIONS
// ================================================================
/**
 * Role names used for authorization & types in role table/model.
 *
 * @property ADMIN - Administrator role with full access.
 * @property CLIENT - Client role with limited access.
 * @property SELLER - Seller role with product management access.
 */
export const ROLE_NAMES = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  SELLER: 'SELLER',
} as const

export type RoleNameKey = keyof typeof ROLE_NAMES

export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES]
