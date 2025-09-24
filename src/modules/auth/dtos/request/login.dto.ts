import { createZodDto } from 'nestjs-zod'
import { LoginSchema } from 'src/modules/auth/schemas'

export class LoginDto extends createZodDto(LoginSchema) {}
