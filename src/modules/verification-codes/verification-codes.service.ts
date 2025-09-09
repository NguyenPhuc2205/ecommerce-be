import { Injectable } from '@nestjs/common'
import { CreateVerificationCode, SendCode } from 'src/modules/verification-codes/schemas'
import { VerificationCodesRepository } from 'src/modules/verification-codes/verification-codes.repository'
import { addMilliseconds } from 'date-fns'
import { randomBytes } from 'crypto'

@Injectable()
export class VerificationCodesService {
  constructor(private readonly vrfCodesRepository: VerificationCodesRepository) {}

  async sendCode(body: SendCode) {
    // Check email already exists

    // TODO: GENERATE OTP AND SEND EMAIL
    const secureOTPCode = this.generateSecureCode(6)
    console.log('Generated secure OTP code: ', secureOTPCode)

    const data: CreateVerificationCode = {
      email: body.email,
      type: body.type,
      code: secureOTPCode,

      // TODO: CONFIGURE EXPIRE TIME FROM .ENV
      expiresAt: addMilliseconds(new Date(), 5 * 60 * 1000), // 5 minutes
    }
    return await this.vrfCodesRepository.createVerificationCode(data)
  }

  // TODO: SEND EMAIL,...

  /**
   * Generate a secure random numeric verification code of specified length.
   * Uses crypto.randomBytes and Big Endian to ensure cryptographic security.
   *
   * @param length Length of the verification code (between 4 and 10)
   * @returns A secure random numeric verification code as a string
   */
  generateSecureCode(length: number) {
    if (length < 4 || length > 10) {
      throw new Error('Verification code length must be between 4 and 10')
    }

    // Range of values: [0, 10^length - 1]
    const max = Math.pow(10, length)

    // Generate random 4 bytes (32-bit unsigned integer)
    // eg: 0x12 34 56 78 (Bin)-> 18 52 86 120 (Dec)
    const buffer = randomBytes(4)

    // Read bytes as unsigned integer and get the modulo with max (value in [0, max - 1])
    // Big Endian (BE) means the most significant byte is at the smallest address
    // Byte1 turn left 24 bits, byte2 turn left 16 bits, byte3 turn left 8 bits, byte4 stay the same to get the final integer value
    // value = byte1 << 24 + byte2 << 16 + byte3 << 8 + byte4 = (18 * 16,777,216) + (52 * 65,536) + (86 * 256) + (120) = 305,419,896
    const code = buffer.readUInt32BE(0) % max

    // Pad with leading zeros
    return code.toString().padStart(length, '0')
  }
}
