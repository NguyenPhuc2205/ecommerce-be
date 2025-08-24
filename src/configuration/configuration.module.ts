import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { TokenService } from 'src/shared/token/token.service'
import { HashingService } from 'src/common/services/hashing.service'
import { validateEnvironmentConfig } from 'src/configuration/env.config'

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

    // ===========================
    // JwtModule
    // ===========================
    JwtModule,
  ],
  providers: [
    TokenService,
    HashingService,

    // Access Token JWT Service
    {
      provide: 'ACCESS_TOKEN_SERVICE',
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
          },
        })
      },
      inject: [ConfigService],
    },

    // Refresh Token JWT Service
    {
      provide: 'REFRESH_TOKEN_SERVICE',
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
          },
        })
      },
      inject: [ConfigService],
    },

    // Redis Configuration
    {
      provide: 'REDIS_CONFIG',
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL')

        if (redisUrl) {
          return { url: redisUrl }
        }

        return {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          db: configService.get<number>('REDIS_DB'),
        }
      },
      inject: [ConfigService],
    },

    // Cloudinary Configuration
    {
      provide: 'CLOUDINARY_CONFIG',
      useFactory: (configService: ConfigService) => ({
        cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: configService.get<string>('CLOUDINARY_API_KEY'),
        api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        upload_preset: configService.get<string>('CLOUDINARY_UPLOAD_PRESET'),
      }),
      inject: [ConfigService],
    },

    // Database Configuration
    {
      provide: 'DATABASE_CONFIG',
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>('DATABASE_URL'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
      }),
      inject: [ConfigService],
    },

    // SendGrid Configuration
    {
      provide: 'SENDGRID_CONFIG',
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('SENDGRID_API_KEY'),
        fromEmail: configService.get<string>('SENDGRID_FROM_EMAIL'),
        fromName: configService.get<string>('SENDGRID_FROM_NAME'),
        templates: {
          userTimesheetReminder: configService.get<string>('DYNAMIC_TEMPLATE_ID_USER_TIMESHEET_REMINDER'),
          pmApprovalReminder: configService.get<string>('DYNAMIC_TEMPLATE_ID_PM_APPROVAL_REMINDER'),
        },
      }),
      inject: [ConfigService],
    },
  ],
  exports: [
    TokenService,
    HashingService,
    'ACCESS_TOKEN_SERVICE',
    'REFRESH_TOKEN_SERVICE',
    'REDIS_CONFIG',
    'CLOUDINARY_CONFIG',
    'DATABASE_CONFIG',
    'SENDGRID_CONFIG',
  ],
})
export class ConfigurationModule {}
