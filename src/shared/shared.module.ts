import { Global, Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { TokenModule } from './token/token.module'
import { SecurityModule } from 'src/shared/security/security.module'

const sharedModules = [DatabaseModule, TokenModule, SecurityModule]

@Global()
@Module({
  imports: sharedModules,
  exports: sharedModules,
})
export class SharedModule {}
