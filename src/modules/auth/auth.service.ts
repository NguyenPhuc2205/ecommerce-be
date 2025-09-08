import { Injectable } from '@nestjs/common'
import { AuthRepository } from 'src/modules/auth/auth.repository'
import { CreateClient, Register } from 'src/modules/auth/schemas'
import { UsersService } from 'src/modules/users/users.service'
import { HashingService } from 'src/shared/security/hashing.service'
import { TokenService } from 'src/shared/token/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  async register(body: Register) {
    // TODO: validate if email or phone number (unique) already exists

    const hashedPassword = this.hashingService.hash(body.password)
    const clientRoleId = 2 // TODO: get client role id from database

    const clientData: CreateClient = {
      email: body.email,
      name: body.name,
      phoneNumber: body.phoneNumber,
      password: hashedPassword,
      roleId: clientRoleId,
    } as const

    const newClient = await this.authRepository.createUser(clientData)

    console.log('[AuthService] New client created: ', newClient)

    return newClient
  }
}
