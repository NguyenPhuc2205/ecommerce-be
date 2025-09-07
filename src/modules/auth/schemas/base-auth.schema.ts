import { USER_STATUS } from 'src/common/constants'
import z from 'zod'

/**
 * Base schema for authentication-related entities.
 * Core user fields - single source of truth.
 * @module Auth
 * @category Schemas
 */
export const BaseAuthSchema = z.object({
  id: z.coerce.number().int().positive(),

  email: z.email().max(500),
  name: z.string().min(2).max(500).trim(),
  phoneNumber: z
    .string()
    .max(50)
    .regex(/^\+?[1-9]\d{1,14}$/),
  password: z.string().min(6).max(500),

  avatar: z.url().max(1000).optional().nullable(),
  cover: z.url().max(1000).optional().nullable(),
  totpSecret: z.string().max(1000).optional().nullable(),
  status: z.enum(USER_STATUS),
  roleId: z.coerce.number().int().positive(),

  // Audit fields
  createdById: z.coerce.number().int().positive().optional().nullable(),
  updatedById: z.coerce.number().int().positive().optional().nullable(),
  deletedById: z.coerce.number().int().positive().optional().nullable(),

  // Timestamps
  deletedAt: z.date().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type BaseAuth = z.infer<typeof BaseAuthSchema>
