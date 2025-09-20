import { IEmailTheme } from '../../interfaces'

export const createVerificationCodeStyles = (theme: IEmailTheme) => ({
  // Container styles
  mainContainer: {
    backgroundColor: theme.colors.background.card,
    maxWidth: theme.email.maxWidth,
    margin: '0 auto',
    boxShadow: theme.shadows.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  } as React.CSSProperties,

  contentContainer: {
    padding: `0 ${theme.spacing.lg}`,
  } as React.CSSProperties,

  // Hero section styles
  heroSection: {
    textAlign: 'center' as const,
    padding: `${theme.spacing.xxl} 0`,
    marginBottom: theme.spacing.xxl,
  } as React.CSSProperties,

  heroIcon: {
    marginBottom: theme.spacing.lg,
    display: 'inline-block',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.full,
    boxShadow: theme.shadows.md,
  } as React.CSSProperties,

  heroIconEmoji: {
    fontSize: '64px',
    lineHeight: 1,
  } as React.CSSProperties,

  heroTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    margin: `0 0 ${theme.spacing.sm} 0`,
    lineHeight: theme.typography.lineHeight.tight,
    letterSpacing: '-0.025em',
  } as React.CSSProperties,

  heroSubtitle: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.secondary,
    margin: 0,
    lineHeight: theme.typography.lineHeight.relaxed,
    fontWeight: theme.typography.fontWeight.medium,
  } as React.CSSProperties,

  // Greeting section styles
  greetingSection: {
    marginBottom: theme.spacing.xxl,
  } as React.CSSProperties,

  greeting: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    margin: `0 0 ${theme.spacing.md} 0`,
    lineHeight: theme.typography.lineHeight.normal,
  } as React.CSSProperties,

  contextText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
    margin: `0 0 ${theme.spacing.lg} 0`,
  } as React.CSSProperties,

  instructionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
    margin: 0,
  } as React.CSSProperties,

  userEmail: {
    color: theme.colors.brand.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  } as React.CSSProperties,

  // Code section styles
  codeSection: {
    marginBottom: theme.spacing.xxl,
    textAlign: 'center' as const,
  } as React.CSSProperties,

  codeContainer: {
    background: theme.colors.background.card,
    border: `2px dashed ${theme.colors.interactive.primary}`,
    borderRadius: theme.borderRadius.lg,
    padding: `${theme.spacing.xl} ${theme.spacing.xxl}`,
    margin: '0 auto',
    maxWidth: '400px',
    boxShadow: theme.shadows.md,
  } as React.CSSProperties,

  codeLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    margin: `0 0 ${theme.spacing.md} 0`,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,

  codeCharsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    margin: `${theme.spacing.md} 0`,
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  codeChar: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.colors.background.elevated,
    border: `2px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.sm,
    padding: '12px 16px',
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: '24px',
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.brand.primary,
    minWidth: '32px',
    height: '48px',
    lineHeight: 1,
    textAlign: 'center' as const,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    boxShadow: theme.shadows.sm,
  } as React.CSSProperties,

  copyButton: {
    backgroundColor: theme.colors.interactive.primary,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    textDecoration: 'none',
    display: 'inline-block',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: theme.typography.fontFamily.primary,
    lineHeight: theme.typography.lineHeight.normal,
    marginTop: theme.spacing.md,
  } as React.CSSProperties,

  codeInstructions: {
    backgroundColor: theme.colors.background.subtle,
    border: `1px solid ${theme.colors.border.subtle}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    maxWidth: '400px',
    margin: `${theme.spacing.lg} auto 0 auto`,
  } as React.CSSProperties,

  expiryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
    margin: `${theme.spacing.xs} 0`,
    fontWeight: theme.typography.fontWeight.medium,
  } as React.CSSProperties,

  instructionHelpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center' as const,
    margin: 0,
    lineHeight: theme.typography.lineHeight.normal,
  } as React.CSSProperties,

  // Action buttons styles
  actionSection: {
    marginBottom: theme.spacing.xxl,
    textAlign: 'center' as const,
  } as React.CSSProperties,

  primaryButton: {
    background: `linear-gradient(135deg, ${theme.colors.interactive.primary} 0%, ${theme.colors.interactive.primaryHover} 100%)`,
    color: `${theme.colors.text.inverse} !important`,
    padding: '16px 32px !important',
    borderRadius: `${theme.borderRadius.lg} !important`,
    fontWeight: `${theme.typography.fontWeight.semibold} !important`,
    textDecoration: 'none !important',
    border: 'none !important',
    cursor: 'pointer !important',
    fontSize: `${theme.typography.fontSize.md} !important`,
    lineHeight: `${theme.typography.lineHeight.normal} !important`,
    transition: 'all 0.2s ease !important',
    boxShadow: `${theme.shadows.md} !important`,
    display: 'inline-block !important',
    minWidth: '200px !important',
    textAlign: 'center' as const,
    marginBottom: `${theme.spacing.md} !important`,
  } as React.CSSProperties,

  fallbackText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeight.normal,
    margin: `${theme.spacing.sm} 0 0 0`,
  } as React.CSSProperties,

  fallbackLink: {
    color: theme.colors.brand.primary,
    textDecoration: 'underline',
    fontWeight: theme.typography.fontWeight.medium,
  } as React.CSSProperties,

  // Divider styles
  divider: {
    borderColor: theme.colors.border.subtle,
    margin: `${theme.spacing.xl} 0`,
  } as React.CSSProperties,

  // Security notice styles
  securitySection: {
    backgroundColor: `${theme.colors.status.warning}08`,
    border: `1px solid ${theme.colors.status.warning}20`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  } as React.CSSProperties,

  securityTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.status.warning,
    margin: `0 0 ${theme.spacing.sm} 0`,
    lineHeight: theme.typography.lineHeight.tight,
  } as React.CSSProperties,

  securityText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.warning,
    lineHeight: theme.typography.lineHeight.relaxed,
    margin: 0,
  } as React.CSSProperties,

  securityStrong: {
    fontWeight: theme.typography.fontWeight.semibold,
  } as React.CSSProperties,

  // Help section styles
  helpSection: {
    textAlign: 'center' as const,
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    border: `1px solid ${theme.colors.border.subtle}`,
  } as React.CSSProperties,

  helpTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    margin: `0 0 ${theme.spacing.sm} 0`,
    lineHeight: theme.typography.lineHeight.tight,
  } as React.CSSProperties,

  helpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
    margin: `0 0 ${theme.spacing.md} 0`,
  } as React.CSSProperties,

  secondaryButton: {
    backgroundColor: `${theme.colors.background.card} !important`,
    color: `${theme.colors.interactive.primary} !important`,
    padding: '12px 24px !important',
    borderRadius: `${theme.borderRadius.md} !important`,
    fontWeight: `${theme.typography.fontWeight.medium} !important`,
    textDecoration: 'none !important',
    border: `2px solid ${theme.colors.interactive.primary} !important`,
    cursor: 'pointer !important',
    fontSize: `${theme.typography.fontSize.sm} !important`,
    lineHeight: `${theme.typography.lineHeight.normal} !important`,
    transition: 'all 0.2s ease !important',
  } as React.CSSProperties,

  // Body styles
  bodyStyle: (theme: IEmailTheme) =>
    ({
      backgroundColor: theme.colors.background.default,
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.normal,
      color: theme.colors.text.primary,
      margin: 0,
      padding: 0,
      width: '100%',
    }) as React.CSSProperties,
})

// CSS string for responsive styles and hover effects
export const getVerificationCodeCSS = (theme: IEmailTheme) => `
  /* Base Reset */
  *, *::before, *::after { box-sizing: border-box; }
  body { 
    margin: 0 !important; 
    padding: 0 !important; 
    width: 100% !important; 
    height: 100% !important;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  table { border-spacing: 0; border-collapse: collapse; }
  img { border: 0; outline: none; text-decoration: none; display: block; }
  
  /* Code Character Hover Effects */
  .code-char:hover {
    border-color: ${theme.colors.brand.primary} !important;
    transform: scale(1.05) !important;
    box-shadow: ${theme.shadows.md} !important;
    background: ${theme.colors.interactive.primaryHover}10 !important;
  }
  
  /* Button Hover Effects */
  .btn-primary:hover {
    transform: translateY(-2px) !important;
    box-shadow: ${theme.shadows.lg} !important;
  }
  
  .btn-secondary:hover {
    background: ${theme.colors.interactive.primary} !important;
    color: ${theme.colors.text.inverse} !important;
    transform: translateY(-1px) !important;
  }
  
  .copy-button:hover {
    background: ${theme.colors.interactive.primaryHover} !important;
    transform: translateY(-1px) !important;
    box-shadow: ${theme.shadows.md} !important;
  }
  
  /* Responsive Styles */
  @media only screen and (max-width: 600px) {
    .mobile-center { text-align: center !important; }
    
    .code-char { 
      font-size: 20px !important; 
      padding: 10px 14px !important; 
      min-width: 28px !important;
      height: 42px !important;
    }
    
    .code-chars-container { 
      gap: 2px !important; 
    }
    
    .btn-primary { 
      width: 100% !important; 
      min-width: auto !important;
      padding: 14px 24px !important;
    }
    
    .btn-secondary {
      width: 100% !important;
      min-width: auto !important;
    }
    
    .hero-title {
      font-size: ${theme.typography.fontSize.xxl} !important;
    }
    
    .hero-subtitle {
      font-size: ${theme.typography.fontSize.lg} !important;
    }
    
    .code-container {
      padding: ${theme.spacing.lg} !important;
      margin: 0 ${theme.spacing.md} !important;
    }
    
    .content-container {
      padding: 0 ${theme.spacing.md} !important;
    }
  }
  
  @media only screen and (max-width: 480px) {
    .hero-icon {
      padding: ${theme.spacing.md} !important;
    }
    
    .hero-icon-emoji {
      font-size: 48px !important;
    }
    
    .code-container {
      padding: ${theme.spacing.md} !important;
    }
  }
`

export default createVerificationCodeStyles
