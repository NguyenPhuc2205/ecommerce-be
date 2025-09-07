import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { CONFIGURATION_PROVIDER_TOKENS } from 'src/configuration/configuration.constant'
import { EnvConfig } from 'src/configuration/env.schema'

export const CONFIGURATION_PROVIDERS: Provider[] = [
  JwtModule,
  {
    provide: CONFIGURATION_PROVIDER_TOKENS.JWT_ACCESS_TOKEN_SERVICE,
    useFactory: (configService: ConfigService<EnvConfig>): JwtService => {
      return new JwtService({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
          issuer: configService.get<string>('APP_NAME'),
          audience: configService.get<string>('APP_NAME'),
        },
      })
    },
    inject: [ConfigService],
  },
  {
    provide: CONFIGURATION_PROVIDER_TOKENS.JWT_REFRESH_TOKEN_SERVICE,
    useFactory: (configService: ConfigService<EnvConfig>): JwtService => {
      return new JwtService({
        secret: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
          issuer: configService.get('APP_NAME'),
          audience: configService.get('APP_NAME'),
        },
      })
    },
    inject: [ConfigService],
  },
]
