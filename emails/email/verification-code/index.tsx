import * as React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Preview,
  Section,
  Text,
  Button,
  Row,
  Column,
  Hr,
  Link,
} from '@react-email/components'
import EmailHeader from '../../components/header'
import EmailFooter from '../../components/footer'
import { EMAIL_THEMES } from '../../styles'
import { IVerificationCodeEmailProps } from '../../interfaces'
import { createVerificationCodeStyles, getVerificationCodeCSS } from './styles'

const VerificationCodeEmail: React.FC<IVerificationCodeEmailProps> = ({
  userEmail,
  userName,
  verificationCode,
  expiryTime = 15,
  companyName = 'Your Company',
  companyLogo,
  supportEmail = 'support@yourcompany.com',
  loginUrl = 'http://localhost:3000/login', // TODO: Change to env variable
  theme = 'LIGHT',
}: IVerificationCodeEmailProps) => {
  const currentTheme = EMAIL_THEMES[theme] || EMAIL_THEMES.LIGHT
  const styles = createVerificationCodeStyles(currentTheme)
  const greeting = userName ? `Have a nice day, ${userName}!` : 'Hello!'

  // Handle undefined/null verification code with fallback
  const displayCode = verificationCode || 'ABC123'
  const previewText = `Your verification code: ${displayCode}`

  // Split code into individual characters for beautiful display
  const codeChars = displayCode.split('')

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <style>{getVerificationCodeCSS(currentTheme)}</style>
      </Head>

      <Preview>{previewText}</Preview>

      <Body style={styles.bodyStyle(currentTheme)}>
        <Container style={styles.mainContainer}>
          {/* Header */}
          <EmailHeader
            logo={companyLogo}
            companyName={companyName}
            tagline="Secure verification for your account"
            variant="gradient"
            theme={theme}
            showNavigation={false}
          />

          {/* Main Content */}
          <div style={styles.contentContainer} className="content-container">
            {/* Hero Section */}
            <Section style={styles.heroSection}>
              <Row>
                <Column align="center">
                  <div style={styles.heroIcon} className="hero-icon">
                    <span style={styles.heroIconEmoji} className="hero-icon-emoji">
                      🔐
                    </span>
                  </div>
                  <Text style={styles.heroTitle} className="hero-title">
                    Verify Your Email
                  </Text>
                  <Text style={styles.heroSubtitle} className="hero-subtitle">
                    Complete your registration with this secure one-time code
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Greeting & Context */}
            <Section style={styles.greetingSection}>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.contextText}>
                We've received a request to verify the email address{' '}
                <strong style={styles.userEmail}>{userEmail || 'user@example.com'}</strong>.
              </Text>
              <Text style={styles.instructionText}>
                Use the verification code below to complete your registration process:
              </Text>
            </Section>

            {/* Verification Code Section */}
            <Section style={styles.codeSection}>
              <Row>
                <Column align="center">
                  <div style={styles.codeContainer} className="code-container">
                    <Text style={styles.codeLabel}>Your Verification Code</Text>

                    {/* Individual Code Characters */}
                    <div style={styles.codeCharsContainer} className="code-chars-container">
                      {codeChars.map((char, index) => (
                        <span key={index} style={styles.codeChar} className="code-char" title={`Click to copy ${char}`}>
                          {char}
                        </span>
                      ))}
                    </div>

                    {/* Copy All Button */}
                    <Button style={styles.copyButton} className="copy-button">
                      📋 Copy All Code
                    </Button>
                  </div>

                  {/* Code Instructions */}
                  <div style={styles.codeInstructions}>
                    <Text style={styles.expiryText}>
                      ⏰ This code expires in <strong>{expiryTime} minutes</strong>
                    </Text>
                    <Text style={styles.instructionHelpText}>Enter this code on the verification page to continue</Text>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Action Buttons */}
            <Section style={styles.actionSection}>
              <Row>
                <Column align="center">
                  <Button href={loginUrl} style={styles.primaryButton} className="btn-primary">
                    Continue Verification
                  </Button>

                  <Text style={styles.fallbackText}>
                    If the button doesn't work,{' '}
                    <Link href={loginUrl} style={styles.fallbackLink}>
                      click here to verify manually
                    </Link>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr style={styles.divider} />

            {/* Security Notice */}
            <Section style={styles.securitySection}>
              <Row>
                <Column>
                  <Text style={styles.securityTitle}>🛡️ Security First</Text>
                  <Text style={styles.securityText}>
                    <strong style={styles.securityStrong}>Keep this code safe:</strong>
                    <br />
                    • Never share your verification code with anyone
                    <br />
                    • Our team will never ask for this code via email or phone
                    <br />• If you didn't request this verification, safely ignore this email
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Help Section */}
            <Section style={styles.helpSection}>
              <Row>
                <Column align="center">
                  <Text style={styles.helpTitle}>Need Assistance?</Text>
                  <Text style={styles.helpText}>
                    If you're having trouble with verification or have any questions, our support team is here to help
                    24/7.
                  </Text>
                  <Button href={`mailto:${supportEmail}`} style={styles.secondaryButton} className="btn-secondary">
                    Contact Support
                  </Button>
                </Column>
              </Row>
            </Section>
          </div>

          {/* Footer */}
          <EmailFooter
            companyName={companyName}
            supportEmail={supportEmail}
            socialLinks={[
              {
                name: 'Twitter',
                url: `https://twitter.com/${companyName.toLowerCase().replace(/\s+/g, '')}`,
                icon: 'https://cdn-icons-png.flaticon.com/24/733/733547.png',
                ariaLabel: 'Follow us on Twitter',
              },
              {
                name: 'Facebook',
                url: `https://facebook.com/${companyName.toLowerCase().replace(/\s+/g, '')}`,
                icon: 'https://cdn-icons-png.flaticon.com/24/124/124010.png',
                ariaLabel: 'Follow us on Facebook',
              },
              {
                name: 'LinkedIn',
                url: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '')}`,
                icon: 'https://cdn-icons-png.flaticon.com/24/124/124017.png',
                ariaLabel: 'Connect with us on LinkedIn',
              },
            ]}
            theme={theme}
          />
        </Container>
      </Body>
    </Html>
  )
}

// Preview props for development/testing
export const previewProps: IVerificationCodeEmailProps = {
  userEmail: 'john.doe@example.com',
  userName: 'John Doe',
  verificationCode: 'ABCD12',
  expiryTime: 15,
  companyName: 'Acme Corporation',
  companyLogo: 'https://placehold.co/80x80/3b82f6/ffffff?text=ACME',
  supportEmail: 'support@acme.com',
  loginUrl: 'https://app.acme.com/verify',
  theme: 'LIGHT',
}

export default VerificationCodeEmail
