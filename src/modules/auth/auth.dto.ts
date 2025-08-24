import z from 'zod'
import { createZodDto } from 'nestjs-zod'

export const RegisterUserSchema = z
  .object({
    email: z.email(),
    name: z.string().min(1).max(100),
    phoneNumber: z.string().min(9).max(15),
    password: z.string().min(6).max(500),
    confirmPassword: z.string().min(6).max(500),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords and confirm password do not match',
        path: ['confirmPassword'],
      })
    }
  })

export class RegisterUserDto extends createZodDto(RegisterUserSchema) {}
