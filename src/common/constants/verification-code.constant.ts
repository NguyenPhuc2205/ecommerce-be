import { IOTPConfig } from '@/common/interfaces'

/**
 * Verification code types used throughout the authentication flow.
 *
 * Defines the different scenarios where verification codes (OTP) are required
 * to ensure secure user identity verification. Each type has specific security
 * requirements and expiration times.
 *
 * @property {string} REGISTER - Verification code sent during user registration to confirm email/phone
 * @property {string} FORGOT_PASSWORD - Verification code sent for password reset requests
 * @property {string} DISABLE_2FA - Verification code required when disabling two-factor authentication
 */
export const VERIFICATION_CODE_TYPES = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  DISABLE_2FA: 'DISABLE_2FA',
  // EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  // PHONE_VERIFICATION: 'PHONE_VERIFICATION',
} as const

export type VerificationCodeType = (typeof VERIFICATION_CODE_TYPES)[keyof typeof VERIFICATION_CODE_TYPES]

/**
 * OTP delivery methods supported by the application.
 *
 * Defines the communication channels through which one-time passwords
 * can be delivered to users for verification purposes.
 *
 * @property {string} EMAIL - Deliver OTP via email
 * @property {string} SMS - Deliver OTP via SMS text message
 * @property {string} VOICE - Deliver OTP via automated voice call
 * @property {string} WHATSAPP - Deliver OTP via WhatsApp message
 */
export const OTP_DELIVERY_METHODS = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  VOICE: 'VOICE',
  WHATSAPP: 'WHATSAPP',
} as const

export type OtpDeliveryMethod = (typeof OTP_DELIVERY_METHODS)[keyof typeof OTP_DELIVERY_METHODS]

/**
 * OTP configuration settings for each verification code type.
 *
 * Provides security-focused configuration for different verification scenarios.
 * Each type has tailored settings for length, expiration, attempt limits, and rate limiting
 * to balance security with user experience.
 *
 * **Security Considerations:**
 * - Registration: More lenient (6 digits, 15 min expiry, 5 attempts) for user convenience
 * - Forgot Password: Stricter (8 chars with letters, 30 min expiry, 3 attempts) due to sensitivity
 * - Disable 2FA: Most restrictive (8 chars, 15 min, 3 attempts, 1 resend) for critical action
 *
 * @type {Record<VerificationCodeType, IOTPConfig>}
 * @see {@link IOTPConfig} for detailed configuration structure
 */
export const OTP_CONFIGS: Record<VerificationCodeType, IOTPConfig> = {
  /**
   * Registration OTP Configuration
   * - 6-digit numeric code
   * - 15-minute expiration
   * - 5 verification attempts
   * - 3 resend attempts
   * - 5 requests per hour limit
   */
  [VERIFICATION_CODE_TYPES.REGISTER]: {
    length: 6,
    expiryMinutes: 15,
    maxAttempts: 5,
    maxResendCount: 3,
    includeLetters: false,
    rateLimitPerHour: 5,
  },

  /**
   * Forgot Password OTP Configuration
   * - 8-character alphanumeric code
   * - 30-minute expiration
   * - 3 verification attempts
   * - 2 resend attempts
   * - 3 requests per hour limit
   */
  [VERIFICATION_CODE_TYPES.FORGOT_PASSWORD]: {
    length: 8,
    expiryMinutes: 30,
    maxAttempts: 3,
    maxResendCount: 2,
    includeLetters: true,
    rateLimitPerHour: 3,
  },

  /**
   * Disable 2FA OTP Configuration
   * - 8-character alphanumeric code
   * - 15-minute expiration
   * - 3 verification attempts
   * - 1 resend attempt (strict)
   * - 2 requests per hour limit
   */
  [VERIFICATION_CODE_TYPES.DISABLE_2FA]: {
    length: 8,
    expiryMinutes: 15,
    maxAttempts: 3,
    maxResendCount: 1,
    includeLetters: true,
    rateLimitPerHour: 2,
  },
}
