import { EmailTheme } from '../styles'

export interface IVerificationCodeEmailProps {
  userEmail?: string
  userName?: string
  verificationCode?: string
  expiryTime?: number
  companyName?: string
  companyLogo?: string
  supportEmail?: string
  loginUrl?: string
  theme?: EmailTheme
}
