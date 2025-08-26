import { Global, Module } from '@nestjs/common'
import { TokenModule } from './token/token.module'

const sharedModules = [TokenModule]

@Global()
@Module({
  imports: sharedModules,
  exports: sharedModules,
})
export class SharedModule {}
