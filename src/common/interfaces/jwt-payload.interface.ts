export interface IJwtPayload {
  sub: string // Subject (user ID or Identifier)
  exp?: number // Expiration time (Unix timestamp)
  iat?: number // Issued at (Unix timestamp)
  iss?: string // Issuer
  aud?: string // Audience
  type?: string // Token type for identification
  [key: string]: any // Flexible for any additional claims
}
