import { BaseVerificationCodeSchema } from '@/modules/verification-codes/dtos/'
import { createZodDto } from 'nestjs-zod'
import z from 'zod'

export const ResendCodeSchema = BaseVerificationCodeSchema.pick({
  identifier: true,
  type: true,
  deliveryMethod: true,
})
  .strict()
  .extend({
    deliveryMethod: BaseVerificationCodeSchema.shape.deliveryMethod.optional(),
  })

export type ResendCode = z.infer<typeof ResendCodeSchema>

export class ResendCodeDto extends createZodDto(ResendCodeSchema) {}
