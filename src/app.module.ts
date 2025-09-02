import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { ConfigurationModule } from './configuration/configuration.module'
import { AuthModule } from './modules/auth/auth.module'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { CustomZodValidationPipe } from 'src/common/pipes'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { RolesModule } from './modules/roles/roles.module'
import { LanguagesModule } from './modules/languages/languages.module'

@Module({
  imports: [SharedModule, ConfigurationModule, AuthModule, RolesModule, LanguagesModule],
  controllers: [AppController],
  providers: [
    AppService,

    // Global Zod validation pipe (nestjs-zod library)
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },

    // Global Zod Serializer Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
