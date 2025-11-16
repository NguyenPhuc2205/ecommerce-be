import { Module } from '@nestjs/common'
import { VerificationCodesController } from './verification-codes.controller'
import { VerificationCodesService } from './services/verification-codes.service'
import { VerificationCodesRepository } from '@/modules/verification-codes/repositories/verification-codes.repository'
import { OtpService } from '@/modules/verification-codes/services'

@Module({
  controllers: [VerificationCodesController],
  providers: [OtpService, VerificationCodesService, VerificationCodesRepository],
  exports: [OtpService, VerificationCodesService],
})
export class VerificationCodesModule {}
