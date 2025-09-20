import { IEmailTheme } from '../../interfaces'

export interface HeaderStyles {
  container: (t?: IEmailTheme) => React.CSSProperties
  gradientContainer: (t?: IEmailTheme) => React.CSSProperties
  simpleContainer: (t?: IEmailTheme) => React.CSSProperties
  logoLink: (t?: IEmailTheme) => React.CSSProperties
  logo: (t?: IEmailTheme) => React.CSSProperties
  simpleLogo: (t?: IEmailTheme) => React.CSSProperties
  companyName: (t?: IEmailTheme) => React.CSSProperties
  tagline: (t?: IEmailTheme) => React.CSSProperties
  navigationRow: (t?: IEmailTheme) => React.CSSProperties
  navigationTable: (t?: IEmailTheme) => React.CSSProperties
  navigationItem: (t?: IEmailTheme) => React.CSSProperties
  navigationLink: (t?: IEmailTheme) => React.CSSProperties
  decorativeLine: (t?: IEmailTheme) => React.CSSProperties
}

const createHeaderStyles = (theme: IEmailTheme): HeaderStyles => ({
  // Main container styles
  container: (t: IEmailTheme = theme) => ({
    backgroundColor: t.colors.background.card,
    padding: `${t.spacing.xl} ${t.spacing.lg}`,
    borderBottom: `1px solid ${t.colors.border.default}`,
    textAlign: 'center' as const,
  }),

  gradientContainer: (t: IEmailTheme = theme) => ({
    background: `linear-gradient(135deg, ${t.colors.brand.primary} 0%, ${t.colors.brand.secondary} 100%)`,
    borderBottom: 'none',
    color: t.colors.text.inverse,
  }),

  simpleContainer: (t: IEmailTheme = theme) => ({
    backgroundColor: t.colors.background.card,
    padding: `${t.spacing.lg} ${t.spacing.md}`,
    borderBottom: `1px solid ${t.colors.border.subtle}`,
    textAlign: 'center' as const,
  }),

  // Logo styles
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logoLink: (t: IEmailTheme = theme) => ({
    display: 'inline-block',
    textDecoration: 'none',
  }),

  logo: (t: IEmailTheme = theme) => ({
    borderRadius: t.borderRadius.sm,
    maxWidth: '200px',
    height: 'auto',
    transition: 'all 0.2s ease',
    boxShadow: t.shadows.sm,
  }),

  simpleLogo: (t: IEmailTheme = theme) => ({
    borderRadius: t.borderRadius.sm,
    maxWidth: '150px',
    height: 'auto',
    transition: 'all 0.2s ease',
  }),

  // Company name and tagline
  companyName: (t: IEmailTheme = theme) => ({
    fontSize: t.typography.fontSize.xxl,
    fontWeight: t.typography.fontWeight.bold,
    color: t.colors.text.primary,
    fontFamily: t.typography.fontFamily.heading,
    margin: `${t.spacing.md} 0 ${t.spacing.sm} 0`,
    textAlign: 'center' as const,
    lineHeight: t.typography.lineHeight.tight,
    letterSpacing: '-0.025em',
  }),

  tagline: (t: IEmailTheme = theme) => ({
    fontSize: t.typography.fontSize.lg,
    color: t.colors.text.secondary,
    fontFamily: t.typography.fontFamily.primary,
    fontStyle: 'italic' as const,
    margin: `${t.spacing.sm} 0 0 0`,
    textAlign: 'center' as const,
    lineHeight: t.typography.lineHeight.normal,
    opacity: 0.8,
  }),

  // Navigation styles
  navigationRow: (t: IEmailTheme = theme) => ({
    margin: `${t.spacing.lg} 0`,
  }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigationTable: (t: IEmailTheme = theme) => ({
    borderSpacing: 0,
    borderCollapse: 'collapse' as const,
  }),

  navigationItem: (t: IEmailTheme = theme) => ({
    padding: `${t.spacing.xs} ${t.spacing.md}`,
  }),

  navigationLink: (t: IEmailTheme = theme) => ({
    color: t.colors.text.tertiary,
    fontSize: t.typography.fontSize.sm,
    fontWeight: t.typography.fontWeight.medium,
    textDecoration: 'none',
    padding: `${t.spacing.xs} ${t.spacing.md}`,
    borderRadius: t.borderRadius.sm,
    transition: 'all 0.2s ease',
    display: 'inline-block',
  }),

  // Decorative elements
  decorativeLine: (t: IEmailTheme = theme) => ({
    width: '60px',
    height: '3px',
    backgroundColor: t.colors.brand.primary,
    borderRadius: t.borderRadius.full,
    margin: `${t.spacing.lg} auto 0 auto`,
    boxShadow: `0 2px 4px ${t.colors.shadow.color}`,
  }),
})

export { createHeaderStyles }
export type HeaderStylesType = ReturnType<typeof createHeaderStyles>
export default createHeaderStyles
