import { BaseVerificationCodeSchema } from 'src/modules/verification-codes/schemas/base-verification-code.schema'
import z from 'zod'

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

          return z
            .string()
            .regex(/^\+?[1-9]\d{1,14}$/)
            .safeParse(val).success
        },
        { message: 'Identifier must be a valid email or phone number' },
      ),
  })

export type SendCode = z.infer<typeof SendCodeSchema>
