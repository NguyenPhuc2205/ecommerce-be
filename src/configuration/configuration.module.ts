import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CONFIGURATION_PROVIDERS } from '@/configuration/configuration.provider'
import { validateEnvironmentConfig } from '@/configuration/env.config'

@Global()
@Module({
  imports: [
    // ===========================
    // ConfigModule
    // ===========================
    ConfigModule.forRoot({
      // Make ConfigService available globally
      isGlobal: true,

      // Use our Zod validation function
      validate: validateEnvironmentConfig,

      // Cache the validated config
      cache: true,

      // Allow variable expansion like ${VAR_NAME}
      // Ex: postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}
      expandVariables: true,

      // Load .env files in order of preference
      envFilePath: ['.env.local', '.env'],

      // Don't ignore .env files if they don't exist in development
      // In prod, env variables are set directly in server
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
  ],
  providers: [...CONFIGURATION_PROVIDERS],
  exports: [...CONFIGURATION_PROVIDERS],
})
export class ConfigurationModule {}
