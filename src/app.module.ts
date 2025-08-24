import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { ConfigurationModule } from './configuration/configuration.module'
import { AuthModule } from './modules/auth/auth.module'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'

@Module({
  imports: [SharedModule, ConfigurationModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,

    // Global Zod validation pipe (nestjs-zod library)
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
