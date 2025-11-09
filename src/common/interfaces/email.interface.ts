import { VerificationCodeType } from '@/common/constants'

export interface IEmailTemplateParams {
  to: string
  code: string
  type: VerificationCodeType
  userName?: string
  expiryMinutes: number
  userEmail: string
}
