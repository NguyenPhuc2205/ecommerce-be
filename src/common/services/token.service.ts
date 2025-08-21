import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { IJwtPayload } from 'src/common/interfaces'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signToken(payload: IJwtPayload, options?: JwtSignOptions) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
      ...options,
    })
  }

  verifyToken(token: string) {
    return this.jwtService.verifyAsync<IJwtPayload>(token, {
      secret: process.env.JWT_SECRET,
    })
  }
}
