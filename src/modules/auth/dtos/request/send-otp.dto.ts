import { createZodDto } from 'nestjs-zod'
import { SendOtpSchema } from 'src/modules/auth/schemas/request/send-otp.schema'

export class SendOtpDto extends createZodDto(SendOtpSchema) {}
