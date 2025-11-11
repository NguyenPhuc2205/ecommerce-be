// ================================================================
// AUTHENTICATION SECTIONS
// ================================================================
/**
 * Authentication strategies.
 *
 * @property {string} JWT - JSON Web Token authentication strategy for stateless authentication
 * @property {string} API_KEY - API Key authentication strategy for service-to-service communication
 * @property {string} NONE - No authentication required (public endpoints)
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
 * Determines how multiple authentication strategies should be evaluated when applied to an endpoint.
 *
 * @property {string} AND - All specified authentication strategies must succeed
 * @property {string} OR - At least one of the specified authentication strategies must succeed
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
 * @property {AuthStrategy[]} authStrategies - Array of authentication strategies to apply
 * @property {Object} options - Configuration options for authentication
 * @property {GuardCondition} options.condition - Condition for combining multiple strategies (AND/OR)
 */
export type AuthMetadata = {
  authStrategies: AuthStrategy[]
  options: { condition: GuardCondition }
}

// ================================================================
// AUTHORIZATION SECTIONS
// ================================================================
/**
 * Predefined role names used throughout the application.
 * Defines the standard user roles for role-based access control (RBAC).
 * These roles should match the roles defined in the database schema
 * and are used for authorization checks.
 *
 * @property {string} ADMIN - Administrator role with full system access and management capabilities
 * @property {string} CLIENT - Client/Customer role with standard user access to purchase and browse
 * @property {string} SELLER - Seller/Vendor role with product management and store administration access
 */
export const ROLE_NAMES = {
  /** Administrator role with full access. */
  ADMIN: 'ADMIN',

  /** Client role with limited access. */
  CLIENT: 'CLIENT',

  /** Seller role with product management access. */
  SELLER: 'SELLER',
} as const

export type RoleNameKey = keyof typeof ROLE_NAMES

export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES]
