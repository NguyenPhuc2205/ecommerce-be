import { JWT_PAYLOAD_FIELDS } from '@/common/constants'

export interface IJwtPayload {
  [JWT_PAYLOAD_FIELDS.SUB]: string // Subject (user ID or Identifier)
  [JWT_PAYLOAD_FIELDS.EXP]?: number // Expiration time (Unix timestamp)
  [JWT_PAYLOAD_FIELDS.IAT]?: number // Issued at (Unix timestamp)
  [JWT_PAYLOAD_FIELDS.ISS]?: string // Issuer (Who created the token)
  [JWT_PAYLOAD_FIELDS.AUD]?: string // Audience (Who will use the token)
  [JWT_PAYLOAD_FIELDS.TYPE]?: string // Token type for identification
  [key: string]: unknown // Flexible for any additional claims
}
