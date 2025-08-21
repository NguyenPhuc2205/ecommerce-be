import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { ConfigurationModule } from './configuration/configuration.module'

@Module({
  imports: [SharedModule, ConfigurationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
