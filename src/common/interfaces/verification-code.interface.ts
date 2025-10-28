/**
 * Configuration for OTP generation and verification
 * @property length - length of the OTP
 * @property expiryMinutes - expiry time in minutes
 * @property maxAttempts - maximum number of verification attempts
 * @property maxResendCount - maximum number of times the OTP can be resent
 * @property includeLetters - whether to include letters in the OTP
 * @property rateLimitPerHour - maximum number of OTP requests per hour
 */
export interface IOTPConfig {
  length: number
  expiryMinutes: number
  maxAttempts: number
  maxResendCount: number
  includeLetters?: boolean
  rateLimitPerHour: number
}

/**
 * Result of OTP generation
 * @property code - the generated OTP code
 * @property hashedCode - the hashed version of the OTP code, hashed via bcrypt
 * @property expiresAt - the expiration date and time of the OTP
 */
export interface IOTPResult {
  code: string
  hashedCode: string
  expiresAt: Date
}

/**
 * Result of OTP verification
 * @property valid - whether the OTP is valid
 * @property expired - whether the OTP has expired
 * @property message - message describing the result
 */
export interface IVerifyOTPResult {
  valid: boolean
  expired: boolean
  message: string
}
