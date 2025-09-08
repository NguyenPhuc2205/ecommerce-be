import { Module } from '@nestjs/common'
import { VerificationCodesController } from './verification-codes.controller'
import { VerificationCodesService } from './verification-codes.service'
import { VerificationCodesRepository } from 'src/modules/verification-codes/verification-codes.repository'

@Module({
  controllers: [VerificationCodesController],
  providers: [VerificationCodesService, VerificationCodesRepository],
  exports: [VerificationCodesService],
})
export class VerificationCodesModule {}
