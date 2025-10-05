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
import { AuthenticationGuard, JwtAuthGuard, XApiKeyGuard } from 'src/common/guards'
import { CatchEverythingFilter } from 'src/common/filters/catch-everything.filter'
import { UsersModule } from './modules/users/users.module'
import { VerificationCodesModule } from './modules/verification-codes/verification-codes.module'
import { PermissionsModule } from './modules/permissions/permissions.module'
import { ResponseTransformInterceptor } from 'src/common/interceptors'

@Module({
  imports: [
    SharedModule,
    ConfigurationModule,
    AuthModule,
    RolesModule,
    LanguagesModule,
    UsersModule,
    VerificationCodesModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtAuthGuard,
    XApiKeyGuard,

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

    /**
     * Global Zod Serializer Interceptor.
     * Used with '@ZodSerializerDto' or '@ZodResponse' to transform & serialize responses based on Zod schemas.
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },

    /**
     * Global Response Transform Interceptor
     * Wraps all successful responses into standard IApiResponse format.
     * Runs after ZodSerializerInterceptor to ensure data is validated/serialized first.
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },

    // Global Filters to catch exceptions
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class AppModule {}
