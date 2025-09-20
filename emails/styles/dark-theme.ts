import { IEmailTheme } from 'emails/interfaces'

export const DARK_THEME: IEmailTheme = {
  colors: {
    brand: {
      primary: '#60a5fa', // blue-400
      secondary: '#94a3b8', // slate-400
      accent: '#a78bfa', // violet-400
    },

    background: {
      default: '#0f172a', // slate-900
      card: '#1e293b', // slate-800
      elevated: '#334155', // slate-700
      subtle: '#1e293b', // slate-800
      muted: '#475569', // slate-600
    },

    text: {
      primary: '#f1f5f9', // slate-100
      secondary: '#cbd5e1', // slate-300
      tertiary: '#94a3b8', // slate-400
      inverse: '#0f172a', // slate-900
      link: '#60a5fa', // blue-400
      linkHover: '#93c5fd', // blue-300
    },

    interactive: {
      primary: '#60a5fa', // blue-400
      primaryHover: '#93c5fd', // blue-300
      primaryActive: '#3b82f6', // blue-500
      primaryDisabled: '#1e3a8a', // blue-900
      secondary: '#334155', // slate-700
      secondaryHover: '#475569', // slate-600
      danger: '#f87171', // red-400
      dangerHover: '#fca5a5', // red-300
    },

    status: {
      success: '#34d399', // emerald-400
      warning: '#fbbf24', // amber-400
      error: '#f87171', // red-400
      info: '#38bdf8', // sky-400
    },

    border: {
      default: '#475569', // slate-600
      subtle: '#334155', // slate-700
      strong: '#64748b', // slate-500
    },

    shadow: {
      color: 'rgba(0, 0, 0, 0.3)',
      overlay: 'rgba(0, 0, 0, 0.75)',
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
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
    focus: '0 0 0 4px rgba(96, 165, 250, 0.4)', // blue-400/40
  },

  email: {
    maxWidth: '600px',
    contentPadding: '24px',
    sectionSpacing: '32px',
  },
} as const

export type DarkTheme = (typeof DARK_THEME)[keyof typeof DARK_THEME]
