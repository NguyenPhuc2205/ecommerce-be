import z from 'zod'
import { createZodDto } from 'nestjs-zod'
import { BaseVerificationCodeSchema } from '@/modules/verification-codes/dtos/base-verification-code.schema'

const VerifyCodeResponseSchema = BaseVerificationCodeSchema.pick({
  userId: true,
})
  .extend({
    message: z.string(),
    verified: z.boolean(),
    verificationCodeId: BaseVerificationCodeSchema.shape.id,
    attemptsRemaining: z.number().int().nonnegative().optional(),
    isLocked: z.boolean().optional(),
    error: z
      .object({
        code: z.enum(['INVALID_CODE', 'EXPIRED', 'ALREADY_USED', 'MAX_ATTEMPTS_REACHED', 'NOT_FOUND']),
        details: z.string().optional(),
      })
      .optional(),
  })
  .strict()

export type VerifyCodeResponse = z.infer<typeof VerifyCodeResponseSchema>

export class VerifyCodeResponseDto extends createZodDto(VerifyCodeResponseSchema) {}
