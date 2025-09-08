import { BaseVerificationCodeSchema } from 'src/modules/verification-codes/schemas/base-verification-code.schema'
import z from 'zod'

export const CreateVerificationCodeSchema = BaseVerificationCodeSchema.pick({
  email: true,
  code: true,
  type: true,
  expiresAt: true,
}).strict()

export type CreateVerificationCode = z.infer<typeof CreateVerificationCodeSchema>
