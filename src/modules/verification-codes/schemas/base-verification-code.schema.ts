import { VERIFICATION_CODE_TYPES } from 'src/common/constants'
import z from 'zod'

export const BaseVerificationCodeSchema = z.object({
  id: z.coerce.number().positive().int(),
  email: z.email().max(500),
  code: z.string().min(4).max(50),
  type: z.enum(VERIFICATION_CODE_TYPES),
  expiresAt: z.date(),
  createdAt: z.date().default(() => new Date()),
})

export type BaseVerigicationCode = z.infer<typeof BaseVerificationCodeSchema>
