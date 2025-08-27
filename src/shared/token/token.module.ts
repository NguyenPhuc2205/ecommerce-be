import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { TokenService } from './token.service'
import { JWT_SERVICES } from 'src/common/constants'
import { EnvConfig } from 'src/configuration/env.schema'

@Module({
  providers: [
    // Access Token JWT Service
    {
      provide: JWT_SERVICES.ACCESS_TOKEN,
      useFactory: (configService: ConfigService<EnvConfig>) => {
        return new JwtService({
          secret: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME', '15m'),
            issuer: configService.get('APP_NAME'),
            audience: configService.get('APP_NAME'),
          },
        })
      },
      inject: [ConfigService],
    },

    // Refresh Token JWT Service
    {
      provide: JWT_SERVICES.REFRESH_TOKEN,
      useFactory: (configService: ConfigService<EnvConfig>) => {
        return new JwtService({
          secret: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME', '7d'),
            issuer: configService.get('APP_NAME'),
            audience: configService.get('APP_NAME'),
          },
        })
      },
      inject: [ConfigService],
    },

    TokenService,
  ],
  exports: [TokenService],
})
export class TokenModule {}
