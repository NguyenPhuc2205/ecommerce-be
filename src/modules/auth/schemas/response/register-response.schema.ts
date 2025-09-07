import { BaseAuthSchema } from 'src/modules/auth/schemas/base-auth.schema'
import z from 'zod'

export const RegisterResponseSchema = BaseAuthSchema.omit({
  password: true,
  totpSecret: true,
})

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
