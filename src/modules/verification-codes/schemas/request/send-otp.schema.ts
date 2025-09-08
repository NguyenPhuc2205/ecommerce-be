import { BaseVerificationCodeSchema } from 'src/modules/verification-codes/schemas/base-verification-code.schema'
import z from 'zod'

export const SendCodeSchema = BaseVerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict()

export type SendCode = z.infer<typeof SendCodeSchema>
