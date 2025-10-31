import { Module } from '@nestjs/common'
import { HashingModule } from '@/shared/security/hashing/hashing.module'
import { RateLimitingModule } from '@/shared/security/rate-limiting/rate-limiting.module'

const securityModules = [HashingModule, RateLimitingModule]
@Module({
  providers: securityModules,
  exports: securityModules,
})
export class SecurityModule {}
