/**
 * JWT payload field names used in the application.
 *
 * @property SUB - Subject (user identifier).
 * @property EXP - Expiration time.
 * @property IAT - Issued at time.
 * @property ISS - Issuer.
 * @property AUD - Audience.
 * @property TYPE - Token type.
 * @property DEVICE_ID - Device identifier.
 * @property ROLE_NAME - Role name associated with the token.
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
 * Token types used in the application.
 * @property ACCESS - Access token.
 * @property REFRESH - Refresh token.
 */
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]
