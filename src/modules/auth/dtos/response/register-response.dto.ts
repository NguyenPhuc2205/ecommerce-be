import { createZodDto } from 'nestjs-zod'
import { RegisterResponseSchema } from 'src/modules/auth/schemas/response/register-response.schema'

export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) {}
