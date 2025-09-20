import { IEmailTheme } from 'emails/interfaces'
import { DARK_THEME } from 'emails/styles/dark-theme'
import { LIGHT_THEME } from 'emails/styles/light-themes'
import { MIDNIGHT_THEME } from 'emails/styles/midnight-theme'
import { OCEAN_THEME } from 'emails/styles/ocean-theme'
import { SUNSET_THEME } from 'emails/styles/sunset-theme'

export * from './dark-theme'
export * from './light-themes'
export * from './ocean-theme'
export * from './sunset-theme'
export * from './midnight-theme'

export const EMAIL_THEMES = {
  LIGHT: LIGHT_THEME,
  DARK: DARK_THEME,
  OCEAN: OCEAN_THEME,
  SUNSET: SUNSET_THEME,
  MIDNIGHT: MIDNIGHT_THEME,
} as const

export type EmailTheme = keyof typeof EMAIL_THEMES

export const DEFAULT_EMAIL_THEME: IEmailTheme = EMAIL_THEMES.LIGHT

export const MEDIA_QUERIES = {
  mobile: '@media only screen and (max-width: 600px)',
  tablet: '@media only screen and (max-width: 768px)',
  desktop: '@media only screen and (min-width: 769px)',
} as const

export type MediaQuery = (typeof MEDIA_QUERIES)[keyof typeof MEDIA_QUERIES]

export type EmailStyle<T extends Record<string, unknown>> = {
  [K in keyof T]: React.CSSProperties
}

export const createEmailStyles = <T extends Record<string, unknown>>(styles: T) => {
  return styles as EmailStyle<T>
}
