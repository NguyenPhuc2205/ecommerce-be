import { createZodDto } from 'nestjs-zod'
import { SendCodeSchema } from 'src/modules/verification-codes/schemas/request/send-code.schema'

export class SendCodeDto extends createZodDto(SendCodeSchema) {}
