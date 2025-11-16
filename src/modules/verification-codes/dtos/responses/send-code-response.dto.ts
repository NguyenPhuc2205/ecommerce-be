import { BaseVerificationCodeSchema } from '@/modules/verification-codes/dtos/base-verification-code.schema'
import { createZodDto } from 'nestjs-zod'
import z from 'zod'

export const SendCodeReponseSchema = BaseVerificationCodeSchema.pick({
  identifier: true,
  userId: true,
  type: true,
  deliveryMethod: true,
  expiresAt: true,
  maxAttempts: true,
  attempts: true,
  resendCount: true,
})
  .extend({
    message: z.string(),
    verificationCodeId: BaseVerificationCodeSchema.shape.id,
    expiresInSeconds: z.number().int().positive(),
    attemptsRemaining: z.number().int().nonnegative(),
    canResend: z.boolean(),
  })
  .strict()

export type SendCodeResponse = z.infer<typeof SendCodeReponseSchema>

export class SendCodeResponseDto extends createZodDto(SendCodeReponseSchema) {}
