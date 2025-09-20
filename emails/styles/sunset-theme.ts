import { IEmailTheme } from 'emails/interfaces'

export const SUNSET_THEME: IEmailTheme = {
  colors: {
    brand: {
      primary: '#ea580c', // orange-600
      secondary: '#a3a3a3', // neutral-400
      accent: '#c026d3', // fuchsia-600
    },

    background: {
      default: '#fffbeb', // amber-50
      card: '#ffffff',
      elevated: '#fef3c7', // amber-100
      subtle: '#fde68a', // amber-200
      muted: '#f59e0b', // amber-500
    },

    text: {
      primary: '#78350f', // amber-800
      secondary: '#92400e', // amber-700
      tertiary: '#d97706', // amber-600
      inverse: '#fffbeb', // amber-50
      link: '#ea580c', // orange-600
      linkHover: '#c2410c', // orange-700
    },

    interactive: {
      primary: '#ea580c', // orange-600
      primaryHover: '#c2410c', // orange-700
      primaryActive: '#9a3412', // orange-800
      primaryDisabled: '#fed7aa', // orange-200
      secondary: '#fde68a', // amber-200
      secondaryHover: '#fcd34d', // amber-300
      danger: '#dc2626', // red-600
      dangerHover: '#b91c1c', // red-700
    },

    status: {
      success: '#16a34a', // green-600
      warning: '#ca8a04', // yellow-600
      error: '#dc2626', // red-600
      info: '#2563eb', // blue-600
    },

    border: {
      default: '#fcd34d', // amber-300
      subtle: '#fde68a', // amber-200
      strong: '#f59e0b', // amber-500
    },

    shadow: {
      color: 'rgba(120, 53, 15, 0.2)', // amber-800/20
      overlay: 'rgba(120, 53, 15, 0.7)', // amber-800/70
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },

  typography: {
    fontFamily: {
      primary: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"Fira Code", Menlo, Monaco, Consolas, monospace',
    },

    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    lineHeight: {
      tight: '1.3',
      normal: '1.6',
      relaxed: '1.8',
    },
  },

  shadows: {
    sm: '0 1px 3px 0 rgba(251, 146, 60, 0.3)',
    md: '0 4px 6px -1px rgba(251, 146, 60, 0.3), 0 2px 4px -2px rgba(251, 146, 60, 0.2)',
    lg: '0 10px 15px -3px rgba(251, 146, 60, 0.3), 0 4px 6px -4px rgba(251, 146, 60, 0.2)',
    focus: '0 0 0 3px rgba(234, 88, 12, 0.4)', // orange-600/40
  },

  email: {
    maxWidth: '600px',
    contentPadding: '32px',
    sectionSpacing: '40px',
  },
}

export type SunsetTheme = (typeof SUNSET_THEME)[keyof typeof SUNSET_THEME]
