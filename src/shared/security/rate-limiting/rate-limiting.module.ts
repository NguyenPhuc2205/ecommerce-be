import { Module } from '@nestjs/common'
import { RateLimitingService } from '@/shared/security/rate-limiting/rate-limiting.service'
@Module({
  providers: [RateLimitingService],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}
