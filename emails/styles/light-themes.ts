import { IEmailTheme } from 'emails/interfaces'

export const LIGHT_THEME: IEmailTheme = {
  colors: {
    brand: {
      primary: '#3b82f6', // blue-500
      secondary: '#64748b', // slate-500
      accent: '#8b5cf6', // violet-500
    },

    background: {
      default: '#ffffff',
      card: '#f8fafc', // slate-50
      elevated: '#ffffff',
      subtle: '#f1f5f9', // slate-100
      muted: '#e2e8f0', // slate-200
    },

    text: {
      primary: '#0f172a', // slate-900
      secondary: '#334155', // slate-700
      tertiary: '#64748b', // slate-500
      inverse: '#ffffff',
      link: '#3b82f6', // blue-500
      linkHover: '#2563eb', // blue-600
    },

    interactive: {
      primary: '#3b82f6', // blue-500
      primaryHover: '#2563eb', // blue-600
      primaryActive: '#1d4ed8', // blue-700
      primaryDisabled: '#93c5fd', // blue-300
      secondary: '#e2e8f0', // slate-200
      secondaryHover: '#cbd5e1', // slate-300
      danger: '#ef4444', // red-500
      dangerHover: '#dc2626', // red-600
    },

    status: {
      success: '#10b981', // emerald-500
      warning: '#f59e0b', // amber-500
      error: '#ef4444', // red-500
      info: '#0ea5e9', // sky-500
    },

    border: {
      default: '#cbd5e1', // slate-300
      subtle: '#e2e8f0', // slate-200
      strong: '#94a3b8', // slate-400
    },

    shadow: {
      color: 'rgba(15, 23, 42, 0.1)', // slate-900/10
      overlay: 'rgba(15, 23, 42, 0.5)', // slate-900/50
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
    sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
    md: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)',
    lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
    focus: '0 0 0 4px rgba(59, 130, 246, 0.3)', // blue-500/30
  },

  email: {
    maxWidth: '600px',
    contentPadding: '24px',
    sectionSpacing: '32px',
  },
} as const

export type LightTheme = (typeof LIGHT_THEME)[keyof typeof LIGHT_THEME]
