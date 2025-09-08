import { Body, Controller, Post } from '@nestjs/common'
import { SendCodeDto } from 'src/modules/verification-codes/dtos/request'
import { VerificationCodesService } from 'src/modules/verification-codes/verification-codes.service'

@Controller('verification-codes')
export class VerificationCodesController {
  constructor(private readonly vrfCodesService: VerificationCodesService) {}

  @Post('send-code')
  async sendCode(@Body() body: SendCodeDto) {
    console.log('Send Code with DTO: ', body)
    const result = await this.vrfCodesService.sendCode(body)
    return result
  }
}
