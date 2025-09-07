import z from 'zod'
import { Environment, LogLevel } from 'src/common/enums'
import {
  createNonEmptyStringSchema,
  createPortSchema,
  createEmailSchema,
  createDatabaseUrlSchema,
  createExpirationSchema,
  createPositiveIntSchema,
  createRangeSchema,
  createStringArraySchema,
} from 'src/common/helpers'

export const envConfigSchema = z.object({
  // ===========================
  // ENVIRONMENT VARIABLES
  // ===========================
  NODE_ENV: z.enum(Environment).default(Environment.DEVELOPMENT),

  APP_DOMAIN: createNonEmptyStringSchema(3).default('localhost'),

  APP_PORT: createPortSchema(1000, 65535).default(3000),

  APP_NAME: createNonEmptyStringSchema(3).default('Ecommerce App'),

  // ===========================
  // API CONFIGURATION
  // ===========================
  API_KEY: createNonEmptyStringSchema(10),

  API_PREFIX: z.string().trim().default('/app/api'),

  API_VERSION: z.string().trim().default('v1'),

  // ===========================
  // CORS CONFIGURATION
  // ===========================
  CORS_ORIGINS: createStringArraySchema().default(['*']),

  // ===========================
  // DATABASE CONFIGURATION
  // ===========================
  // PostgreSQL DB_URL
  DATABASE_URL: createDatabaseUrlSchema(),

  DB_HOST: createNonEmptyStringSchema(),

  DB_PORT: createPortSchema(1, 65535),

  DB_USERNAME: createNonEmptyStringSchema(),

  DB_PASSWORD: createNonEmptyStringSchema(),

  DB_DATABASE: createNonEmptyStringSchema(),

  // ===========================
  // AUTH CONFIGURATION
  // ===========================
  JWT_ACCESS_TOKEN_SECRET: createNonEmptyStringSchema(),

  JWT_ACCESS_TOKEN_EXPIRATION_TIME: createExpirationSchema().default('1h'),

  JWT_REFRESH_TOKEN_SECRET: createNonEmptyStringSchema(),

  JWT_REFRESH_TOKEN_EXPIRATION_TIME: createExpirationSchema().default('7d'),

  // ===========================
  // LOGGING CONFIGURATION
  // ===========================
  LOG_LEVEL: z.enum(LogLevel).default(LogLevel.INFO),

  LOG_FILE: z.string().trim().default('logs/app.log'),

  // ===========================
  // GOOGLE CONFIGURATION
  // ===========================
  GOOGLE_CLIENT_ID: z.string().optional(),

  // ===========================
  // SENDGRID CONFIGURATION
  // ===========================
  SENDGRID_API_KEY: createNonEmptyStringSchema(),

  SENDGRID_FROM_EMAIL: createEmailSchema(5),

  SENDGRID_FROM_NAME: createNonEmptyStringSchema(),

  DYNAMIC_TEMPLATE_ID_USER_TIMESHEET_REMINDER: z.string().optional(),

  DYNAMIC_TEMPLATE_ID_PM_APPROVAL_REMINDER: z.string().optional(),

  // ===========================
  // CLOUDINARY CONFIGURATION
  // ===========================
  CLOUDINARY_CLOUD_NAME: createNonEmptyStringSchema(),

  CLOUDINARY_API_KEY: createNonEmptyStringSchema(),

  CLOUDINARY_API_SECRET: createNonEmptyStringSchema(),

  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),

  // ===========================
  // REDIS CONFIGURATION
  // ===========================
  REDIS_HOST: createNonEmptyStringSchema().default('localhost'),

  REDIS_PORT: createPortSchema(1, 65535).default(6379),

  REDIS_PASSWORD: z.string().optional(),

  REDIS_DB: createRangeSchema(0, 15).default(0),

  REDIS_URL: z.string().optional(),

  // ===========================
  // SESSION CONFIGURATION
  // ===========================
  SESSION_SECRET: createNonEmptyStringSchema(10),

  SESSION_MAX_AGE: createPositiveIntSchema().default(86400000), // 24 hours in ms

  // ===========================
  // RATE LIMITING
  // ===========================
  RATE_LIMIT_TTL: createPositiveIntSchema().default(60), // seconds

  RATE_LIMIT_MAX: createPositiveIntSchema().default(10), // requests per TTL

  // ===========================
  // FILE UPLOAD
  // ===========================
  MAX_FILE_SIZE: createPositiveIntSchema().default(5242880), // 5MB in bytes

  UPLOAD_PATH: z.string().default('./uploads'),

  // ===========================
  // GITHUB API CONFIGURATION
  // ===========================

  // ===========================
  // ADMINISTRATOR INFORMATION
  // ===========================
  ADMIN_EMAIL: createEmailSchema(5).default('admin@example.com'),

  ADMIN_PASSWORD: createNonEmptyStringSchema(8).default('admin1234'),

  // ===========================
  // OTP CONFIGURATION
  // ===========================
  OTP_EXPIRATION: createExpirationSchema().default('10m'),
})

export type EnvConfig = z.infer<typeof envConfigSchema>
