import { Global, Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { TokenModule } from './token/token.module'
import { SecurityModule } from 'src/shared/security/security.module'
import { EmailModule } from 'src/shared/email/email.module'

const sharedModules = [DatabaseModule, EmailModule, TokenModule, SecurityModule]

@Global()
@Module({
  imports: sharedModules,
  exports: sharedModules,
})
export class SharedModule {}
