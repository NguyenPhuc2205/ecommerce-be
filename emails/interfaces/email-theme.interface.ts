export interface IEmailTheme {
  colors: {
    // Main brand colors
    brand: {
      primary: string
      secondary: string
      accent: string
    }

    // Background hierarchy
    background: {
      default: string // Main background color
      card: string // Card or container background
      elevated: string // Elevated background (e.g., for modals)
      subtle: string // Subtle background (light variant, section separators, less emphasis)
      muted: string // Muted background (dimmed/disabled areas, lowest emphasis)
    }

    // Text colors
    text: {
      primary: string
      secondary: string
      tertiary: string
      inverse: string
      link: string
      linkHover: string
    }

    // Interactive states
    interactive: {
      primary: string
      primaryHover: string
      primaryActive: string
      primaryDisabled: string
      secondary: string
      secondaryHover: string
      danger: string
      dangerHover: string
    }

    // Status/Feedback colors
    status: {
      success: string
      warning: string
      error: string
      info: string
    }

    // Border & dividers
    border: {
      default: string
      subtle: string
      strong: string
    }

    // Shadows & overlays
    shadow: {
      color: string
      overlay: string
    }
  }

  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }

  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }

  typography: {
    fontFamily: {
      primary: string
      heading: string
      mono: string
    }

    fontSize: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      xxl: string
      xxxl: string
    }

    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }

    lineHeight: {
      tight: string
      normal: string
      relaxed: string
    }
  }

  shadows: {
    sm: string
    md: string
    lg: string
    focus: string
  }

  // Email-specific properties
  email: {
    maxWidth: string
    contentPadding: string
    sectionSpacing: string
  }
}
