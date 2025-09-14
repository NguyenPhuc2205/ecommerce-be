import { BaseVerificationCodeSchema } from 'src/modules/verification-codes/schemas/base-verification-code.schema'
import z from 'zod'

export const CreateVerificationCodeSchema = BaseVerificationCodeSchema.pick({
  identifier: true,
  code: true,
  type: true,
  deliveryMethod: true,
  maxAttempts: true,
  userId: true,
  expiresAt: true,
}).strict()

export type CreateVerificationCode = z.infer<typeof CreateVerificationCodeSchema>
