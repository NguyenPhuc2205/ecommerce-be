import { Body, Controller, Post } from '@nestjs/common'
import { SendCodeDto, SendCodeResponseDto } from '@/modules/verification-codes/dtos'
import { VerificationCodesService } from '@/modules/verification-codes/services'
import { ZodSerializerDto } from 'nestjs-zod'

@Controller('verification-codes')
export class VerificationCodesController {
  constructor(private readonly vrfCodesService: VerificationCodesService) {}

  @Post('send-code')
  @ZodSerializerDto(SendCodeResponseDto)
  async sendCode(@Body() body: SendCodeDto) {
    console.log('Send Code with DTO: ', body)
    const result = await this.vrfCodesService.sendCode(body)
    return result
  }

  // @Post('verify-code')
  // async verifyCode(@Body() body: VerifyCodeDto) {
  //   console.log('Verify Code with DTO: ', body)
  //   return await this.vrfCodesService.verifyCode(body)
  // }
}
