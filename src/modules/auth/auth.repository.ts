import { Injectable } from '@nestjs/common'
import { BaseAuth, CreateClient } from 'src/modules/auth/schemas'
import { PrismaService } from 'src/shared/database/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateClient): Promise<Omit<BaseAuth, 'confirmPassword' | 'totpSecret'>> {
    console.log('Creating user with data: ', data)
    return await this.prismaService.user.create({
      data,
    })
  }
}
