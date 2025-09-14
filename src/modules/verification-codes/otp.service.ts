import { Injectable } from '@nestjs/common'
import { randomInt } from 'crypto'
import { IOTPConfig, IOTPResult, IVerifyOTPResult } from 'src/common/interfaces'
import { HashingService } from 'src/shared/security/hashing.service'
@Injectable()
export class OtpService {
  constructor(private readonly hashingService: HashingService) {}

  public generateOTPWithExpiry(config: IOTPConfig): IOTPResult {
    const code = this.generateSecureOTP(config.length, config.includeLetters)
    const hashedCode = this.hashingService.hash(code)
    const expiresAt = new Date(Date.now() + config.expiryMinutes * 60 * 1000)

    return {
      code,
      hashedCode,
      expiresAt,
    }
  }

  public verifyOTP(code: string, hashedCode: string, expiresAt: Date): IVerifyOTPResult {
    if (new Date() > expiresAt) {
      return {
        valid: false,
        expired: true,
        message: 'Verification code has expired',
      }
    }

    const isValid: boolean = this.hashingService.compare(code, hashedCode)
    return {
      valid: isValid,
      expired: false,
      message: isValid ? 'Verification code is valid' : 'Invalid verification code',
    }
  }

  /**
   * Generates a secure OTP (One-Time Password).
   * @param length The length of the OTP (between 4 and 10).
   * @param includeLetters Whether to include letters in the OTP.
   * @returns The generated OTP.
   */
  private generateSecureOTP(length: number, includeLetters = false): string {
    if (length < 4 || length > 10) {
      throw new Error('OTP length must be between 4 and 10')
    }

    const digits = '0123456789'
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // Exclude I, O to avoid confusion with 0, 1
    const characters = includeLetters ? digits + letters : digits

    let otp = ''
    for (let i = 0; i < length; ++i) {
      const index = randomInt(0, characters.length) // 0 <= index < characters.length
      otp += characters[index]
    }

    // If includeLetters is true, ensure at least one digit exists
    if (includeLetters && !/\d/.test(otp)) {
      const randomPosition = randomInt(0, length)
      const randomDigit = digits[randomInt(0, digits.length)]

      // String is immutable, cannot modify directly with index (ABCXYZ -> 'ABC' + '1' + 'YZ')
      otp = otp.substring(0, randomPosition) + randomDigit + otp.substring(randomPosition + 1)
    }

    return otp
  }
}
