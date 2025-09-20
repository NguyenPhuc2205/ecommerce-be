import { EmailTheme } from 'emails/styles'

export interface SocialLink {
  name: string
  url: string
  icon: string
  ariaLabel?: string
}

export interface LegalLink {
  label: string
  href: string
}

export interface IEmailFooterProps {
  companyName: string
  companyUrl?: string
  address?: string
  unsubscribeUrl?: string
  socialLinks?: SocialLink[]
  supportEmail?: string
  legalLinks?: LegalLink[]
  theme?: EmailTheme
  showSocial?: boolean
  showLegal?: boolean
}
