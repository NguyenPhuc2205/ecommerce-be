import { createZodDto } from 'nestjs-zod'
import { RegisterSchema } from 'src/modules/auth/schemas/request/register.schema'

export class RegisterDto extends createZodDto(RegisterSchema) {}
