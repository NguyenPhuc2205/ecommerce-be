import { Injectable } from '@nestjs/common'
import { HashingService, PrismaService, TokenService } from 'src/common/services'
import { RegisterUserDto } from 'src/modules/auth/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,

    private readonly hashingService: HashingService,

    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterUserDto) {
    const hashedPassword = this.hashingService.hash(body.password)
    const user = await this.prismaService.user.create({
      data: {
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: 1,
      },
    })

    return user
  }
}
