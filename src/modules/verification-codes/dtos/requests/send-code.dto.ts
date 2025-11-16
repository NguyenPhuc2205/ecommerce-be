import z from 'zod'
import { BaseVerificationCodeSchema } from '@/modules/verification-codes/dtos/base-verification-code.schema'
import { REGEX_PATTERNS } from '@/common/constants'
import { createZodDto } from 'nestjs-zod'

export const SendCodeSchema = BaseVerificationCodeSchema.pick({
  identifier: true,
  type: true,
  deliveryMethod: true,
  userId: true,
})
  .strict()
  .extend({
    identifier: z
      .string()
      .min(1)
      .max(500)
      .refine(
        (val) => {
          if (val.includes('@')) {
            return z.email().safeParse(val).success
          }

          return z.string().regex(REGEX_PATTERNS.COMMON.PHONE).safeParse(val).success
        },
        { message: 'Identifier must be a valid email or phone number' },
      ),
  })

export type SendCode = z.infer<typeof SendCodeSchema>

export class SendCodeDto extends createZodDto(SendCodeSchema) {}
