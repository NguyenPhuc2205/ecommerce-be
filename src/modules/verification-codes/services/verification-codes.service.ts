import { BadRequestException, Injectable } from '@nestjs/common'
import { VerificationCodesRepository } from '@/modules/verification-codes/repositories/verification-codes.repository'
import { ResendService } from '@/shared/email/resend.service'
import { OtpService } from '@/modules/verification-codes/services'
import { SendCodeDto } from '@/modules/verification-codes/dtos'
import { ConfigService } from '@nestjs/config'
import { EnvConfig } from '@/configuration'
import { OTP_CONFIGS, VerificationCodeType } from '@/common/constants'

@Injectable()
export class VerificationCodesService {
  private readonly testingMode: boolean
  private readonly testingCode: string

  constructor(
    private readonly vrfCodesRepository: VerificationCodesRepository,
    private readonly otpService: OtpService,
    private readonly resendService: ResendService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.testingMode = this.configService.get('RESEND_ENABLED_TESTING_MODE', { infer: true }) as boolean
    this.testingCode = this.configService.get('RESEND_TESTING_CODE', { infer: true }) as string
  }

  async sendCode(body: SendCodeDto) {
    const { identifier, type, userId, deliveryMethod } = body
    const config = this.getConfig(type)

    const existingCode = await this.vrfCodesRepository.findFirst(
      {
        identifier,
        type,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      undefined,
      { createdAt: 'desc' },
    )

    if (existingCode && existingCode.resendCount >= config.maxResendCount) {
      throw new BadRequestException('Maximum resend attempts reached. Please request a new verification code.')
    }

    const { code, hashedCode, expiresAt } = await this.otpService.generateOTPWithExpiry(type)

    let recordId: number | null = null
    if (existingCode) {
      await this.vrfCodesRepository.updateById(
        existingCode.id,
        {
          code: hashedCode,
          expiresAt,
          resendCount: { increment: 1 },
          deliveryMethod,
        },
        undefined,
      )

      recordId = existingCode.id
    } else {
      const newVerificationCode = await this.vrfCodesRepository.create({
        identifier,
        code: hashedCode,
        type,
        deliveryMethod,
        maxAttempts: config.maxAttempts,
        expiresAt,
        user: { connect: userId ? { id: userId } : undefined },
      })

      recordId = newVerificationCode.id
    }

    return {
      message: 'Verification code sent successfully',
      verificationCodeId: recordId,
      expiresInSeconds: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
      code: this.testingMode ? this.testingCode : code,
    }
  }

  private getConfig(type: VerificationCodeType) {
    return OTP_CONFIGS[type]
  }
}
