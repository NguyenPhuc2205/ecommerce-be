import z from 'zod'
import { BaseVerificationCodeSchema } from '@/modules/verification-codes/dtos/base-verification-code.schema'
import { createZodDto } from 'nestjs-zod'

export const VerifyCodeSchema = BaseVerificationCodeSchema.pick({
  identifier: true,
  code: true,
  type: true,
}).strict()

export type VerifyCode = z.infer<typeof VerifyCodeSchema>

export class VerifyCodeDto extends createZodDto(VerifyCodeSchema) {}
