import { IOTPConfig } from '@/common/interfaces'

export const VERIFICATION_CODE_TYPES = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  DISABLE_2FA: 'DISABLE_2FA',
} as const

export type VerificationCodeType = (typeof VERIFICATION_CODE_TYPES)[keyof typeof VERIFICATION_CODE_TYPES]

export const OTP_DELIVERY_METHODS = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  VOICE: 'VOICE',
  WHATSAPP: 'WHATSAPP',
} as const

export type OtpDeliveryMethod = (typeof OTP_DELIVERY_METHODS)[keyof typeof OTP_DELIVERY_METHODS]

export const OTP_CONFIGS: Record<VerificationCodeType, IOTPConfig> = {
  [VERIFICATION_CODE_TYPES.REGISTER]: {
    length: 6,
    expiryMinutes: 15,
    maxAttempts: 5,
    maxResendCount: 3,
    includeLetters: false,
    rateLimitPerHour: 5,
  },
  [VERIFICATION_CODE_TYPES.FORGOT_PASSWORD]: {
    length: 8,
    expiryMinutes: 30,
    maxAttempts: 3,
    maxResendCount: 2,
    includeLetters: true,
    rateLimitPerHour: 3,
  },
  [VERIFICATION_CODE_TYPES.DISABLE_2FA]: {
    length: 8,
    expiryMinutes: 15,
    maxAttempts: 3,
    maxResendCount: 1,
    includeLetters: true,
    rateLimitPerHour: 2,
  },
}
