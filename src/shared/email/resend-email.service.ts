import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { EnvConfig } from 'src/configuration/env.schema'
@Injectable()
export class ResendEmailService {
  private resend: Resend

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.resend = new Resend(this.configService.get('RESEND_API'))
  }

  sendVerificationCodeEmail(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['nguyenhuuphuc22052004@gmail.com'],
      subject: 'Your verification code',
      html: `<strong>Your verification code is ${payload.code}</strong>`,
    })
  }
}
