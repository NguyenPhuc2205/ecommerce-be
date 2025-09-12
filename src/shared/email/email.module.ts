import { Module } from '@nestjs/common'
import { ResendEmailService } from 'src/shared/email/resend-email.service'

@Module({
  providers: [ResendEmailService],
  exports: [ResendEmailService],
})
export class EmailModule {}
