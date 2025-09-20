import * as React from 'react'
import { Column, Img, Row, Section, Text, Link } from '@react-email/components'
import createHeaderStyles from './styles'
import { IEmailHeaderProps } from '../../interfaces'
import { EMAIL_THEMES } from '../../styles'

export const EmailHeader: React.FC<IEmailHeaderProps> = ({
  logo = 'https://placehold.co/80x80/2563eb/ffffff?text=LOGO',
  logoAlt = 'Company Logo',
  companyName = 'Your Company',
  companyUrl = 'https://yourcompany.com',
  tagline = 'Building amazing shopping experiences',
  variant = 'default',
  theme = 'LIGHT',
  showNavigation = false,
  navigationLinks = [],
  showDivider = true,
  logoWidth = 80,
  logoHeight = 80,
}) => {
  const currentTheme = EMAIL_THEMES[theme] || EMAIL_THEMES.LIGHT
  const styles = createHeaderStyles(currentTheme)

  const getContainerStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'gradient':
        return {
          ...styles.container(currentTheme),
          ...styles.gradientContainer(currentTheme),
        }
      case 'minimal':
        return styles.simpleContainer(currentTheme)
      default:
        return styles.container(currentTheme)
    }
  }

  const getLogoStyle = (): React.CSSProperties => {
    return variant === 'minimal' ? styles.simpleLogo(currentTheme) : styles.logo(currentTheme)
  }

  const logoDimensions = variant === 'minimal' ? { width: 60, height: 60 } : { width: logoWidth, height: logoHeight }

  return (
    <Section style={getContainerStyle()}>
      {/* Logo Row */}
      <Row>
        <Column align="center">
          <Link href={companyUrl} style={styles.logoLink(currentTheme)}>
            <Img
              src={logo}
              alt={logoAlt}
              width={logoDimensions.width}
              height={logoDimensions.height}
              style={getLogoStyle()}
            />
          </Link>
        </Column>
      </Row>

      {/* Company Name & Tagline (if logo is not provided or minimal variant) */}
      {(variant === 'minimal' || !logo) && (
        <Row>
          <Column align="center">
            <Text style={styles.companyName(currentTheme)}>{companyName}</Text>
            {tagline && <Text style={styles.tagline(currentTheme)}>{tagline}</Text>}
          </Column>
        </Row>
      )}

      {/* Navigation Links */}
      {showNavigation && navigationLinks && navigationLinks.length > 0 && (
        <Row style={styles.navigationRow(currentTheme)}>
          <Column align="center">
            <table style={styles.navigationTable(currentTheme)}>
              <tbody>
                <tr>
                  {navigationLinks.map((link, index) => (
                    <td key={index} style={styles.navigationItem(currentTheme)}>
                      <Link href={link.href} style={styles.navigationLink(currentTheme)}>
                        {link.label}
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Column>
        </Row>
      )}

      {/* Decorative Line */}
      {showDivider && (
        <Row>
          <Column>
            <div style={styles.decorativeLine(currentTheme)} />
          </Column>
        </Row>
      )}
    </Section>
  )
}

// Simplified header for transactional emails
export const SimpleEmailHeader: React.FC<Pick<IEmailHeaderProps, 'logo' | 'logoAlt' | 'companyUrl' | 'theme'>> = ({
  logo = 'https://placehold.co/60x60/2563eb/ffffff?text=LOGO',
  logoAlt = 'Company Logo',
  companyUrl = 'https://yourcompany.com',
  theme = 'LIGHT',
}) => {
  const currentTheme = EMAIL_THEMES[theme] || EMAIL_THEMES.LIGHT
  const styles = createHeaderStyles(currentTheme)

  return (
    <Section style={styles.simpleContainer(currentTheme)}>
      <Row>
        <Column align="center">
          <Link href={companyUrl} style={styles.logoLink(currentTheme)}>
            <Img src={logo} alt={logoAlt} width="60" height="60" style={styles.simpleLogo(currentTheme)} />
          </Link>
        </Column>
      </Row>
    </Section>
  )
}

export default EmailHeader
