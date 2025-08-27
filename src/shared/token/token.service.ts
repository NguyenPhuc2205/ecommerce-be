import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JWT_SERVICES, TOKEN_TYPES, TokenType } from 'src/common/constants'
import { IJwtPayload, ITokenPair } from 'src/common/interfaces'

@Injectable()
export class TokenService {
  constructor(
    @Inject(JWT_SERVICES.ACCESS_TOKEN)
    private readonly accessTokenJwtService: JwtService,

    @Inject(JWT_SERVICES.REFRESH_TOKEN)
    private readonly refreshTokenJwtService: JwtService,
  ) {}

  /**
   * Get the appropriate JWT service based on the token type
   * @param type The type of token (access or refresh)
   * @returns The corresponding JwtService instance
   */
  private getJwtService(type: TokenType): JwtService {
    switch (type) {
      case TOKEN_TYPES.ACCESS:
        return this.accessTokenJwtService
      case TOKEN_TYPES.REFRESH:
        return this.refreshTokenJwtService
      default:
        throw new Error(`Unsupported token type: ${type as string}`)
    }
  }

  /**
   * Sign a JWT token
   * @param type The type of token (access or refresh)
   * @param payload The payload to include in the token
   * @returns The signed JWT token
   */
  async sign(type: TokenType, payload: IJwtPayload): Promise<string> {
    const jwtService = this.getJwtService(type)
    const tokenPayload = { ...payload, type }
    return jwtService.signAsync(tokenPayload)
  }

  /**
   * Verify a JWT token
   * @param type The type of token (access or refresh)
   * @param token The JWT token to verify
   * @returns The decoded payload if the token is valid
   */
  async verify<T = IJwtPayload>(type: TokenType, token: string): Promise<T> {
    const jwtService = this.getJwtService(type)
    return jwtService.verifyAsync(token) as Promise<T>
  }

  /**
   * Decode a JWT token
   * @param token The JWT token to decode
   * @returns The decoded payload or null if invalid
   */
  decode(token: string): IJwtPayload | null {
    try {
      // Use any service for decoding (they all decode the same way)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = this.getJwtService(TOKEN_TYPES.ACCESS).decode(token)
      return decoded ? (decoded as IJwtPayload) : null
    } catch {
      return null
    }
  }

  /**
   * Generate both access and refresh tokens
   * @param payload The payload to include in the tokens
   * @returns The generated access and refresh tokens
   */
  async generateTokenPair(payload: IJwtPayload): Promise<ITokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.sign(TOKEN_TYPES.ACCESS, payload),
      this.sign(TOKEN_TYPES.REFRESH, { sub: payload.sub }),
    ])

    return { accessToken, refreshToken }
  }

  /**
   * Generate new token pair using refresh token.
   * @param refreshToken The refresh token to use
   * @returns The new access and refresh tokens
   */
  async refreshTokens(refreshToken: string): Promise<ITokenPair> {
    const payload = await this.verify(TOKEN_TYPES.REFRESH, refreshToken)
    return this.generateTokenPair({ sub: payload.sub })
  }

  /**
   * Check if token is valid
   * @param type The type of token (access or refresh)
   * @param token The JWT token to check
   * @returns True if the token is valid, false otherwise
   */
  async isValid(type: TokenType, token: string): Promise<boolean> {
    try {
      await this.verify(type, token)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get token expiration date
   * @param token The JWT token to check
   * @returns The expiration date or null if invalid
   */
  getTokenExpiry(token: string): Date | null {
    try {
      const decoded = this.decode(token)
      return decoded?.exp ? new Date(decoded.exp * 1000) : null
    } catch {
      return null
    }
  }

  /**
   * Check if token is expired.
   * @param token The JWT token to check
   * @returns True if the token is expired, false otherwise
   */
  isTokenExpired(token: string): boolean {
    try {
      const expiry = this.getTokenExpiry(token)
      return expiry ? expiry < new Date() : false
    } catch {
      return true
    }
  }

  /**
   * Get remaining time until token expires (in seconds).
   * @param token The JWT token to check
   * @returns The remaining time until expiration or null if invalid
   */
  getTokenRemainingTime(token: string): number | null {
    try {
      const expiry = this.getTokenExpiry(token)
      if (!expiry) return null

      const now = new Date()
      const remaining = Math.floor((expiry.getTime() - now.getTime()) / 1000)
      return remaining > 0 ? remaining : 0
    } catch {
      return null
    }
  }
}
