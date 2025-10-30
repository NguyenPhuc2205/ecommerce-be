import z from 'zod'
import { Environment, LogLevel } from '@/common/enums'
import { DATABASE_URL_REGEX, EXPIRE_TIME_REGEX, CRON_SCHEDULE_REGEX } from '@/common/constants'

export const envConfigSchema = z.object({
  // ================================================================
  // ENVIRONMENT VARIABLES
  // ================================================================
  NODE_ENV: z.enum(Environment).default(Environment.DEVELOPMENT),

  APP_DOMAIN: z.string().trim().min(3).default('localhost'),

  APP_PORT: z.coerce.number().int().positive().min(1000).max(65535).default(3000),

  APP_NAME: z.string().trim().min(3).default('Ecommerce App'),

  // ================================================================
  // API CONFIGURATION
  // ================================================================
  API_KEY: z.string().trim().min(10),

  API_PREFIX: z.string().trim().default('/app/api'),

  API_VERSION: z.string().trim().default('v1'),

  API_URL: z.string().trim().url().optional(),

  // ================================================================
  // CORS CONFIGURATION
  // ================================================================
  CORS_ORIGINS: z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().min(1)))
    .default(['*']),

  // ================================================================
  // DATABASE CONFIGURATION
  // ================================================================
  DATABASE_URL: z.string().regex(DATABASE_URL_REGEX, 'Must be a valid PostgreSQL connection string'),

  DB_HOST: z.string().trim().min(1),

  DB_PORT: z.coerce.number().int().positive().min(1).max(65535),

  DB_USERNAME: z.string().trim().min(1),

  DB_PASSWORD: z.string().trim().min(1),

  DB_DATABASE: z.string().trim().min(1),

  // ================================================================
  // AUTH CONFIGURATION
  // ================================================================
  JWT_ACCESS_TOKEN_SECRET: z.string().trim().min(1),

  JWT_ACCESS_TOKEN_EXPIRATION_TIME: z
    .string()
    .regex(EXPIRE_TIME_REGEX, 'Must be in format like "1h", "30m", "7d"')
    .default('1h'),

  JWT_ACCESS_TOKEN_WITH_REMEMBER_ME_EXPIRATION_TIME: z
    .string()
    .regex(EXPIRE_TIME_REGEX, 'Must be in format like "1h", "30m", "7d"')
    .default('30d'),

  JWT_REFRESH_TOKEN_SECRET: z.string().trim().min(1),

  JWT_REFRESH_TOKEN_EXPIRATION_TIME: z
    .string()
    .regex(EXPIRE_TIME_REGEX, 'Must be in format like "1h", "30m", "7d"')
    .default('7d'),

  // ================================================================
  // BCRYPT CONFIGURATION - HASHING
  // ================================================================
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),

  // ================================================================
  // LOGGING CONFIGURATION
  // ================================================================
  LOG_LEVEL: z.enum(LogLevel).default(LogLevel.INFO),

  LOG_FILE: z.string().trim().default('logs/app.log'),

  // ================================================================
  // GOOGLE CONFIGURATION
  // ================================================================
  GOOGLE_CLIENT_ID: z.string().optional(),

  // ================================================================
  // CLOUDINARY CONFIGURATION
  // ================================================================
  CLOUDINARY_CLOUD_NAME: z.string().trim().min(1),

  CLOUDINARY_API_KEY: z.string().trim().min(1),

  CLOUDINARY_API_SECRET: z.string().trim().min(1),

  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),

  // ================================================================
  // REDIS CONFIGURATION
  // ================================================================
  REDIS_HOST: z.string().trim().min(1).default('localhost'),

  REDIS_PORT: z.coerce.number().int().positive().min(1).max(65535).default(6379),

  REDIS_PASSWORD: z.string().optional(),

  REDIS_DB: z.coerce.number().min(0).max(15).default(0),

  REDIS_URL: z.string().optional(),

  // ================================================================
  // SESSION CONFIGURATION
  // ================================================================
  SESSION_SECRET: z.string().trim().min(10),

  SESSION_MAX_AGE: z.coerce.number().int().positive().default(86400000), // 24 hours in ms

  // ================================================================
  // RATE LIMITING
  // ================================================================
  RATE_LIMIT_TTL: z.coerce.number().int().positive().default(60), // seconds

  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10), // requests per TTL

  // ================================================================
  // FILE UPLOAD
  // ================================================================
  MAX_FILE_SIZE: z.coerce.number().int().positive().default(5242880), // 5MB in bytes

  UPLOAD_PATH: z.string().default('./uploads'),

  // ================================================================
  // ADMINISTRATOR INFORMATION
  // ================================================================
  ADMIN_EMAIL: z.string().email().min(5).toLowerCase().trim().default('admin@example.com'),

  ADMIN_PASSWORD: z.string().trim().min(8).default('admin1234'),

  // ================================================================
  // OTP CONFIGURATION
  // ================================================================
  OTP_EXPIRATION: z.string().regex(EXPIRE_TIME_REGEX, 'Must be in format like "1h", "30m", "7d"').default('10m'),

  OTP_DEFAULT_LENGTH: z.coerce.number().int().positive().min(4).max(8).default(6),

  OTP_MAX_LENGTH: z.coerce.number().int().positive().min(4).max(8).default(8),

  OTP_MIN_LENGTH: z.coerce.number().int().positive().min(4).max(8).default(4),

  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),

  OTP_MAX_RESEND_COUNT: z.coerce.number().int().positive().default(3),

  OTP_RATE_LIMIT_PER_HOUR: z.coerce.number().int().positive().default(10),

  OTP_RATE_LIMIT_TTL: z.coerce.number().int().positive().default(3600),

  // ================================================================
  // EMAIL SERVICE - RESEND
  // ================================================================
  RESEND_API: z.string().trim().min(1),

  RESEND_FROM_EMAIL: z.string().email().min(5).toLowerCase().trim(),

  RESEND_FROM_NAME: z.string().trim().min(1).default('Ecommerce App'),

  RESEND_CC_EMAIL: z.string().email().min(5).toLowerCase().trim().optional(),

  RESEND_BCC_EMAIL: z.string().email().min(5).toLowerCase().trim().optional(),

  RESEND_REPLY_TO_EMAIL: z.string().email().min(5).toLowerCase().trim().optional(),

  RESEND_ENABLED_TESTING_MODE: z.coerce.boolean().default(false),

  // ================================================================
  // EMAIL TEMPLATES CONFIGURATION
  // ================================================================
  EMAIL_COMPANY_NAME: z.string().trim().min(1).default('Ecommerce App'),

  EMAIL_COMPANY_LOGO: z.string().trim().url().optional(),

  EMAIL_SUPPORT_EMAIL: z.string().email().min(5).toLowerCase().trim().optional(),

  EMAIL_LOGIN_URL: z.string().trim().url().optional(),

  EMAIL_VERIFY_URL: z.string().trim().url().optional(),

  EMAIL_SUPPORT_URL: z.string().trim().url().optional(),

  EMAIL_THEME: z.string().trim().default('LIGHT'),

  // ================================================================
  // SMS SERVICE - TWILIO
  // ================================================================
  TWILIO_ACCOUNT_SID: z.string().optional(),

  TWILIO_AUTH_TOKEN: z.string().optional(),

  TWILIO_PHONE_NUMBER: z.string().optional(),

  TWILIO_SMS_ENABLED_TESTING_MODE: z.coerce.boolean().default(false),

  TWILIO_FALLBACK_EMAIL: z.coerce.boolean().default(true),

  // ================================================================
  // VERIFICATION CODES CONFIGURATION
  // ================================================================
  VERIFICATION_CLEAN_CRON_SCHEDULE: z
    .string()
    .regex(CRON_SCHEDULE_REGEX, 'Must be a valid cron schedule expression')
    .default('0 0 * * *'),

  VERIFICATION_RETENTION_DAYS: z.coerce.number().int().positive().default(7),

  VERIFICATION_MAX_CONCURRENT_REQUESTS: z.coerce.number().int().positive().default(1),

  VERIFICATION_LOCK_TIMEOUT: z.coerce.number().int().positive().default(10000),

  // ================================================================
  // GITHUB CONFIGURATION
  // ================================================================
  GITHUB_TOKEN: z.string().optional(),
})

export type EnvConfig = z.infer<typeof envConfigSchema>
