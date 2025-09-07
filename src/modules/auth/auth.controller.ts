import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { IsPublic } from 'src/common/decorators'
import { RegisterDto } from 'src/modules/auth/dtos/request/register.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { RegisterResponseDto } from 'src/modules/auth/dtos/response/register-response.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('register')
  @ZodSerializerDto(RegisterResponseDto)
  async register(@Body() body: RegisterDto) {
    console.log('Register user with DTO: ', body)
    const result = await this.authService.register(body)
    return result
  }
}
