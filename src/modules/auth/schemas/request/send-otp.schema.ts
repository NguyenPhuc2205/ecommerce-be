import { BaseVerificationCodeSchema } from 'src/modules/auth/schemas/base-verification-code.schema'

export const SendOtpSchema = BaseVerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict()
