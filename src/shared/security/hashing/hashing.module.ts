import { Module } from '@nestjs/common'
import { HashingService } from '@/shared/security/hashing/hashing.service'

@Module({
  providers: [HashingService],
  exports: [HashingService],
})
export class HashingModule {}
