import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { EnvConfig } from '@/configuration/env.schema'
@Injectable()
export class ResendEmailService {
  private resend: Resend

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.resend = new Resend(this.configService.get('RESEND_API'))
  }

  sendVerificationCodeEmail(payload: { email: string; code: string }) {
    // TODO: Use a proper email template, load from, cc emails from .env
    // TODO: Handle errors and logging (pending, error,...)
    return this.resend.emails.send({
      from: 'Ecommerce <no-reply@nguyenhuuphuc.id.vn>',
      to: [payload.email],
      subject: 'Your verification code',
      html: `<strong>Your verification code is ${payload.code}</strong>`,
    })
  }
}
