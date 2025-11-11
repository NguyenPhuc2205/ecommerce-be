/**
 * JWT payload field names used throughout the application.
 *
 * Defines the standard claims and custom fields included in JSON Web Tokens.
 * These field names follow JWT conventions (RFC 7519) for registered claims
 * and include application-specific custom claims.
 *
 * @property {string} SUB - Subject claim - unique identifier of the user (typically user ID)
 * @property {string} EXP - Expiration time claim - token expiry timestamp (Unix epoch)
 * @property {string} IAT - Issued at claim - token issuance timestamp (Unix epoch)
 * @property {string} ISS - Issuer claim - entity that issued the token
 * @property {string} AUD - Audience claim - intended recipient of the token
 * @property {string} TYPE - Custom claim for token type (access/refresh)
 * @property {string} DEVICE_ID - Custom claim for device identification
 * @property {string} ROLE_NAME - Custom claim for user's role name
 *
 * @see {@link https://tools.ietf.org/html/rfc7519#section-4.1 | RFC 7519 - Registered Claim Names}
 */
export const JWT_PAYLOAD_FIELDS = {
  SUB: 'sub',
  EXP: 'exp',
  IAT: 'iat',
  ISS: 'iss',
  AUD: 'aud',
  TYPE: 'type',
  DEVICE_ID: 'deviceId',
  ROLE_NAME: 'roleName',
} as const

export type JwtPayloadFieldType = (typeof JWT_PAYLOAD_FIELDS)[keyof typeof JWT_PAYLOAD_FIELDS]

/**
 * Token types used in the application's authentication system.
 *
 * Distinguishes between different JWT token purposes to enable
 * proper validation and security measures.
 *
 * @property {string} ACCESS - Short-lived access token for API authentication
 * @property {string} REFRESH - Long-lived refresh token for obtaining new access tokens
 */
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]
