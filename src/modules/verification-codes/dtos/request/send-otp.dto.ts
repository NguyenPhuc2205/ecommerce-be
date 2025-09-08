import { createZodDto } from 'nestjs-zod'
import { SendCodeSchema } from 'src/modules/verification-codes/schemas/request/send-otp.schema'

export class SendCodeDto extends createZodDto(SendCodeSchema) {}
