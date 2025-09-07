import { BaseAuthSchema } from 'src/modules/auth/schemas/base-auth.schema'
import z from 'zod'

export const RegisterSchema = BaseAuthSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  password: true,
})
  .extend({
    confirmPassword: BaseAuthSchema.shape.password,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type Register = z.infer<typeof RegisterSchema>

export const CreateClientSchema = RegisterSchema.omit({
  confirmPassword: true,
}).extend({
  roleId: BaseAuthSchema.shape.roleId,
})

export type CreateClient = z.infer<typeof CreateClientSchema>
