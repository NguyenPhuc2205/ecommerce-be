import { createZodDto } from 'nestjs-zod'
import { RefreshTokenSchema } from 'src/modules/auth/schemas/request/refresh-token.schema'

export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {}
