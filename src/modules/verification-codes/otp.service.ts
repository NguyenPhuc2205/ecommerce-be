import { OTP_CONFIGS, VerificationCodeType } from '@/common/constants'
import { IOTPConfig, IOTPResult, IVerifyOTPResult } from '@/common/interfaces'
import { HashingService } from '@/shared/security/hashing.service'
import { Injectable } from '@nestjs/common'
import { randomInt } from 'crypto'

@Injectable()
export class OtpService {
  constructor(private readonly hashingService: HashingService) {}

  // ================================================================
  // MAIN METHODS
  // ================================================================
  /**
   * Generates a secure OTP (One-Time Password).
   * @param type - The type of OTP to generate.
   * @param customConfig - Optional custom configuration for the OTP.
   * @returns The generated OTP and its hashed version.
   */
  public async generateOTPWithExpiry(type: VerificationCodeType, customConfig?: IOTPConfig): Promise<IOTPResult> {
    const config = customConfig || this.getOTPConfig(type)
    const code = this.generateSecureOTP(config.length, config.includeLetters)
    const hashedCode = await this.hashingService.hash(code)
    return {
      code,
      hashedCode,
      expiresAt: new Date(Date.now() + config.expiryMinutes * 60 * 1000),
    }
  }

  /**
   * Verifies the provided OTP code against the hashed code and checks for expiration.
   * @param code - The OTP code to verify.
   * @param hashedCode - The hashed version of the OTP code.
   * @param expiresAt - The expiration date of the OTP code.
   * @returns The result of the verification process.
   */
  public async verifyOTP(code: string, hashedCode: string, expiresAt: Date): Promise<IVerifyOTPResult> {
    if (new Date() > expiresAt) {
      return {
        valid: false,
        expired: true,
        message: 'Verification code has expired',
      }
    }

    const isValidCode: boolean = await this.hashingService.compare(code, hashedCode)
    return {
      valid: isValidCode,
      expired: false,
      message: isValidCode ? 'Verification code is valid' : 'Invalid verification code',
    }
  }

  // ================================================================
  // HELPER FUNCTIONS
  // ================================================================
  /**
   * Retrieves the OTP configuration for the specified type.
   * @param type - The type of OTP.
   * @returns The OTP configuration.
   */
  private getOTPConfig(type: VerificationCodeType) {
    return OTP_CONFIGS[type]
  }

  /**
   * Generates a secure OTP (One-Time Password).
   * @param length - The length of the OTP.
   * @param includeLetters - Whether to include letters in the OTP.
   * @returns The generated OTP.
   */
  private generateSecureOTP(length: number, includeLetters?: boolean): string {
    if (length < 4 || length > 12) {
      throw new Error('OTP length must be between 4 and 12')
    }

    const digits = '0123456789'
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const characters = includeLetters ? digits + letters : digits

    let otp: string = ''

    for (let i = 0; i < length; ++i) {
      const randomIndex = randomInt(0, characters.length)
      otp += characters[randomIndex]
    }

    // Ensure at least one digit is included if letters are used
    if (includeLetters && !/\d/.test(otp)) {
      const randomPosition = randomInt(0, length)
      const randomDigit = digits[randomInt(0, digits.length)]
      otp = otp.substring(0, randomPosition) + randomDigit + otp.substring(randomPosition + 1)
    }

    return otp
  }
}
