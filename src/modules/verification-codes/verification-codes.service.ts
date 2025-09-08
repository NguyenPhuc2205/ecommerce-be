import { Injectable } from '@nestjs/common'
import { CreateVerificationCode, SendCode } from 'src/modules/verification-codes/schemas'
import { VerificationCodesRepository } from 'src/modules/verification-codes/verification-codes.repository'
import { addMilliseconds } from 'date-fns'

@Injectable()
export class VerificationCodesService {
  constructor(private readonly vrfCodesRepository: VerificationCodesRepository) {}

  async sendCode(body: SendCode) {
    // TODO: GENERATE OTP AND SEND EMAIL
    const mockOtp = '123456'
    const data: CreateVerificationCode = {
      email: body.email,
      type: body.type,
      code: mockOtp,

      // TODO: CONFIGURE EXPIRE TIME FROM .ENV
      expiresAt: addMilliseconds(new Date(), 5 * 60 * 1000), // 5 minutes
    }
    return await this.vrfCodesRepository.createVerificationCode(data)
  }

  // TODO: SEND EMAIL,...
}
