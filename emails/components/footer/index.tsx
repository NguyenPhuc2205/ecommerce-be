import * as React from 'react'
import { Section, Text, Link, Hr, Row, Column } from '@react-email/components'
import createFooterStyles from './styles'
import { EMAIL_THEMES } from '../../styles'
import { IEmailFooterProps } from '../../interfaces'

export const EmailFooter: React.FC<IEmailFooterProps> = ({
  companyName,
  companyUrl = '#',
  address,
  unsubscribeUrl,
  socialLinks = [],
  supportEmail,
  legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
  theme = 'LIGHT',
  showSocial = true,
  showLegal = true,
}) => {
  const currentTheme = EMAIL_THEMES[theme] || EMAIL_THEMES.LIGHT
  const styles = createFooterStyles(currentTheme)

  return (
    <>
      <Hr style={styles.divider} />
      <Section style={styles.container}>
        {/* Social Links */}
        {showSocial && socialLinks.length > 0 && (
          <Row style={styles.socialRow}>
            <Column align="center">
              {socialLinks.map((social, index) => (
                <Link
                  key={social.name}
                  href={social.url}
                  aria-label={social.ariaLabel || `Visit our ${social.name}`}
                  style={{
                    ...styles.socialLink,
                    marginRight: index < socialLinks.length - 1 ? currentTheme.spacing.md : '0',
                  }}
                >
                  <img src={social.icon} alt={social.name} width="24" height="24" style={styles.socialIcon} />
                </Link>
              ))}
            </Column>
          </Row>
        )}

        {/* Company Info */}
        <Row>
          <Column align="center">
            <Text style={styles.companyName}>
              <Link href={companyUrl} style={styles.companyLink}>
                {companyName}
              </Link>
            </Text>
            {address && <Text style={styles.address}>{address}</Text>}
            {supportEmail && (
              <Text style={styles.supportText}>
                Need help?{' '}
                <Link href={`mailto:${supportEmail}`} style={styles.supportLink}>
                  Contact our support team
                </Link>
              </Text>
            )}
          </Column>
        </Row>

        {/* Legal Links */}
        {showLegal && (
          <Row style={styles.legalRow}>
            <Column align="center">
              <Text style={styles.copyrightText}>
                © {new Date().getFullYear()} {companyName}. All rights reserved.
              </Text>
              <Text style={styles.legalLinks}>
                {unsubscribeUrl && (
                  <>
                    <Link href={unsubscribeUrl} style={styles.legalLink}>
                      Unsubscribe
                    </Link>{' '}
                    •{' '}
                  </>
                )}
                {legalLinks.map((link, index) => (
                  <React.Fragment key={link.label}>
                    <Link href={link.href} style={styles.legalLink}>
                      {link.label}
                    </Link>
                    {index < legalLinks.length - 1 && ' • '}
                  </React.Fragment>
                ))}
              </Text>
            </Column>
          </Row>
        )}
      </Section>
    </>
  )
}

export default EmailFooter
