import { Injectable } from '@nestjs/common'
import { CreateVerificationCode } from 'src/modules/verification-codes/schemas'
import { PrismaService } from 'src/shared/database/prisma.service'

@Injectable()
export class VerificationCodesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createVerificationCode(data: CreateVerificationCode) {
    return await this.prismaService.verificationCode.upsert({
      where: {
        email: data.email,
      },
      create: data,
      update: data,
    })
  }
}
