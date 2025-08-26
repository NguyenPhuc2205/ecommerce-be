export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]

// JWT Service Injection Tokens
export const JWT_SERVICES = {
  ACCESS_TOKEN: 'ACCESS_TOKEN_JWT_SERVICE',
  REFRESH_TOKEN: 'REFRESH_TOKEN_JWT_SERVICE',
} as const

export type JwtServiceType = (typeof JWT_SERVICES)[keyof typeof JWT_SERVICES]
