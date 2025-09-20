import { EmailTheme } from '../styles'

export interface INavigationLink {
  label: string
  href: string
}

export interface IEmailHeaderProps {
  logo?: string
  logoAlt?: string
  companyName?: string
  companyUrl?: string
  tagline?: string
  variant?: 'default' | 'minimal' | 'gradient'
  theme?: EmailTheme
  showNavigation?: boolean
  navigationLinks?: INavigationLink[]
  showDivider?: boolean
  logoWidth?: number
  logoHeight?: number
}
