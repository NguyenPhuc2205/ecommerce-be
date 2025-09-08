import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { ConfigurationModule } from './configuration/configuration.module'
import { AuthModule } from './modules/auth/auth.module'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { CustomZodValidationPipe } from 'src/common/pipes'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { RolesModule } from './modules/roles/roles.module'
import { LanguagesModule } from './modules/languages/languages.module'
import { AuthenticationGuard } from 'src/common/guards'
import { CatchEverythingFilter } from 'src/common/filters/catch-everything.filter'
import { UsersModule } from './modules/users/users.module'
import { VerificationCodesModule } from './modules/verification-codes/verification-codes.module'

@Module({
  imports: [
    SharedModule,
    ConfigurationModule,
    AuthModule,
    RolesModule,
    LanguagesModule,
    UsersModule,
    VerificationCodesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Global Guard (Auth for x-api-key, jwt, etc.)
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },

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

    // Global Filters to catch exceptions
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class AppModule {}
