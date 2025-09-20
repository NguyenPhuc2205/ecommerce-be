import { IEmailTheme } from 'emails/interfaces'

export const OCEAN_THEME: IEmailTheme = {
  colors: {
    brand: {
      primary: '#0891b2', // cyan-600
      secondary: '#0f766e', // teal-700
      accent: '#db2777', // pink-600
    },

    background: {
      default: '#f0fdfa', // teal-50
      card: '#ffffff',
      elevated: '#ffffff',
      subtle: '#ccfbf1', // teal-100
      muted: '#99f6e4', // teal-200
    },

    text: {
      primary: '#134e4a', // teal-800
      secondary: '#0f766e', // teal-700
      tertiary: '#14b8a6', // teal-500
      inverse: '#f0fdfa', // teal-50
      link: '#0891b2', // cyan-600
      linkHover: '#0e7490', // cyan-700
    },

    interactive: {
      primary: '#0891b2', // cyan-600
      primaryHover: '#0e7490', // cyan-700
      primaryActive: '#155e75', // cyan-800
      primaryDisabled: '#67e8f9', // cyan-300
      secondary: '#99f6e4', // teal-200
      secondaryHover: '#5eead4', // teal-300
      danger: '#dc2626', // red-600
      dangerHover: '#b91c1c', // red-700
    },

    status: {
      success: '#059669', // emerald-600
      warning: '#d97706', // amber-600
      error: '#dc2626', // red-600
      info: '#0284c7', // sky-600
    },

    border: {
      default: '#5eead4', // teal-300
      subtle: '#99f6e4', // teal-200
      strong: '#2dd4bf', // teal-400
    },

    shadow: {
      color: 'rgba(19, 78, 74, 0.15)', // teal-800/15
      overlay: 'rgba(19, 78, 74, 0.6)', // teal-800/60
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
    md: '10px',
    lg: '14px',
    xl: '18px',
    full: '9999px',
  },

  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: '"Playfair Display", Georgia, serif',
      mono: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
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
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  shadows: {
    sm: '0 1px 3px 0 rgba(19, 78, 74, 0.1)',
    md: '0 4px 6px -1px rgba(19, 78, 74, 0.15), 0 2px 4px -2px rgba(19, 78, 74, 0.1)',
    lg: '0 10px 15px -3px rgba(19, 78, 74, 0.15), 0 4px 6px -4px rgba(19, 78, 74, 0.1)',
    focus: '0 0 0 3px rgba(8, 145, 178, 0.3)', // cyan-600/30
  },

  email: {
    maxWidth: '600px',
    contentPadding: '28px',
    sectionSpacing: '36px',
  },
} as const

export type OceanTheme = (typeof OCEAN_THEME)[keyof typeof OCEAN_THEME]
