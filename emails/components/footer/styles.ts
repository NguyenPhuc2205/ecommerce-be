import { IEmailTheme } from '../../interfaces'

interface FooterStyles {
  divider: React.CSSProperties
  container: React.CSSProperties
  socialRow: React.CSSProperties
  socialLink: React.CSSProperties
  socialIcon: React.CSSProperties
  companyName: React.CSSProperties
  companyLink: React.CSSProperties
  address: React.CSSProperties
  supportText: React.CSSProperties
  supportLink: React.CSSProperties
  legalRow: React.CSSProperties
  copyrightText: React.CSSProperties
  legalLinks: React.CSSProperties
  legalLink: React.CSSProperties
}

const createFooterStyles = (theme: IEmailTheme): FooterStyles => ({
  divider: {
    borderColor: theme.colors.border.subtle,
    margin: `${theme.spacing.xl} 0`,
  },

  container: {
    backgroundColor: theme.colors.background.subtle,
    padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
    borderTop: `1px solid ${theme.colors.border.subtle}`,
  },

  socialRow: {
    marginBottom: theme.spacing.lg,
  },

  socialLink: {
    display: 'inline-block',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    borderRadius: theme.borderRadius.full,
  },

  socialIcon: {
    borderRadius: theme.borderRadius.full,
    transition: 'all 0.2s ease',
    opacity: 0.7,
  },

  companyName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    margin: `${theme.spacing.sm} 0`,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeight.normal,
  },

  companyLink: {
    color: theme.colors.text.primary,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },

  address: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    margin: `${theme.spacing.sm} 0`,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeight.relaxed,
  },

  supportText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    margin: `${theme.spacing.md} 0`,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeight.normal,
  },

  supportLink: {
    color: theme.colors.brand.primary,
    textDecoration: 'none',
    fontWeight: theme.typography.fontWeight.semibold,
    transition: 'all 0.2s ease',
  },

  legalRow: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border.subtle}`,
  },

  copyrightText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    margin: `${theme.spacing.xs} 0 ${theme.spacing.sm} 0`,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeight.normal,
  },

  legalLinks: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    margin: 0,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeight.normal,
  },

  legalLink: {
    color: theme.colors.text.tertiary,
    textDecoration: 'underline',
    fontWeight: theme.typography.fontWeight.medium,
    transition: 'color 0.2s ease',
  },
})

export { createFooterStyles }
export type FooterStylesType = ReturnType<typeof createFooterStyles>
export default createFooterStyles
