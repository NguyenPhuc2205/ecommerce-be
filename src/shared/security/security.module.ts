import { Module } from '@nestjs/common'
import { HashingService } from 'src/shared/security/hashing.service'

@Module({
  providers: [HashingService],
  exports: [HashingService],
})
export class SecurityModule {}
