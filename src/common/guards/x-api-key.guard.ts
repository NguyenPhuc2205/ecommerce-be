import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { EnvConfig } from 'src/configuration/env.schema'

@Injectable()
export class XApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Get HTTP context & Express request
    const http: HttpArgumentsHost = context.switchToHttp()
    const request: Request = http.getRequest()

    // Get API key from request headers
    const xApiKey = request.headers['x-api-key'] || request.headers['X-API-KEY']
    if (!xApiKey) {
      throw new UnauthorizedException('Missing API key, please provide a valid API key.')
    }

    // Get API_KEY from .env config
    const apiKey = this.configService.get<string>('API_KEY')

    // Compare the API keys
    return xApiKey === apiKey
  }
}
