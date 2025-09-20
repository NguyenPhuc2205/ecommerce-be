import { IEmailTheme } from 'emails/interfaces'

export const MIDNIGHT_THEME: IEmailTheme = {
  colors: {
    brand: {
      primary: '#8b5cf6', // violet-500
      secondary: '#6366f1', // indigo-500
      accent: '#ec4899', // pink-500
    },

    background: {
      default: '#0c0a09', // stone-950
      card: '#1c1917', // stone-900
      elevated: '#292524', // stone-800
      subtle: '#1c1917', // stone-900
      muted: '#44403c', // stone-700
    },

    text: {
      primary: '#fafaf9', // stone-50
      secondary: '#d6d3d1', // stone-300
      tertiary: '#a8a29e', // stone-400
      inverse: '#0c0a09', // stone-950
      link: '#8b5cf6', // violet-500
      linkHover: '#a78bfa', // violet-400
    },

    interactive: {
      primary: '#8b5cf6', // violet-500
      primaryHover: '#a78bfa', // violet-400
      primaryActive: '#7c3aed', // violet-600
      primaryDisabled: '#3730a3', // indigo-800
      secondary: '#292524', // stone-800
      secondaryHover: '#44403c', // stone-700
      danger: '#f87171', // red-400
      dangerHover: '#fca5a5', // red-300
    },

    status: {
      success: '#4ade80', // green-400
      warning: '#facc15', // yellow-400
      error: '#f87171', // red-400
      info: '#60a5fa', // blue-400
    },

    border: {
      default: '#44403c', // stone-700
      subtle: '#292524', // stone-800
      strong: '#78716c', // stone-500
    },

    shadow: {
      color: 'rgba(0, 0, 0, 0.5)',
      overlay: 'rgba(0, 0, 0, 0.85)',
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
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },

  typography: {
    fontFamily: {
      primary: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: '"Clash Display", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", Monaco, Consolas, monospace',
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
    sm: '0 2px 4px 0 rgba(139, 92, 246, 0.1)',
    md: '0 8px 16px -4px rgba(139, 92, 246, 0.2), 0 4px 8px -4px rgba(0, 0, 0, 0.3)',
    lg: '0 16px 32px -8px rgba(139, 92, 246, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.4)',
    focus: '0 0 0 3px rgba(139, 92, 246, 0.5)', // violet-500/50
  },

  email: {
    maxWidth: '600px',
    contentPadding: '32px',
    sectionSpacing: '48px',
  },
} as const

export type MidnightTheme = (typeof MIDNIGHT_THEME)[keyof typeof MIDNIGHT_THEME]
