import { OTPDeliveryMethod } from '@prisma/client'
import { OTP_DELIVERY_METHODS, VERIFICATION_CODE_TYPES } from '@/common/constants'
import z from 'zod'

export const BaseVerificationCodeSchema = z.object({
  id: z.coerce.number().int().positive(),

  identifier: z.string().min(1).max(500),
  code: z.string().min(4).max(255),
  type: z.enum(VERIFICATION_CODE_TYPES),

  attempts: z.coerce.number().int().nonnegative().default(0),
  maxAttempts: z.coerce.number().int().positive().max(10).default(5),
  isUsed: z.boolean().default(false),
  resendCount: z.coerce.number().int().nonnegative().default(0),
  deliveryMethod: z.enum(OTPDeliveryMethod).default(OTP_DELIVERY_METHODS.EMAIL),
  userId: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.date(),

  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  usedAt: z.date().optional().nullable(),
})

export type BaseVerificationCode = z.infer<typeof BaseVerificationCodeSchema>
