import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterUserDto } from 'src/modules/auth/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() bodyDto: RegisterUserDto) {
    console.log('Register user with DTO: ', bodyDto)
    const result = await this.authService.register(bodyDto)
    return result
  }
}
