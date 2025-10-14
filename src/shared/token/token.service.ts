import { Inject, Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { Request } from 'express'
import { TOKEN_TYPES, TokenType } from '@/common/constants'
import { IJwtPayload, ITokenPair } from '@/common/interfaces'
import { CONFIGURATION_PROVIDER_TOKENS } from '@/configuration/configuration.constant'

@Injectable()
export class TokenService {
  constructor(
    @Inject(CONFIGURATION_PROVIDER_TOKENS.JWT_ACCESS_TOKEN_SERVICE)
    private readonly accessTokenJwtService: JwtService,

    @Inject(CONFIGURATION_PROVIDER_TOKENS.JWT_REFRESH_TOKEN_SERVICE)
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
  async sign(type: TokenType, payload: IJwtPayload, options?: JwtSignOptions): Promise<string> {
    const jwtService: JwtService = this.getJwtService(type)
    const tokenPayload = { ...payload, type }
    return jwtService.signAsync(tokenPayload, options)
  }

  /**
   * Verify a JWT token
   * @param type The type of token (access or refresh)
   * @param token The JWT token to verify
   * @returns The decoded payload if the token is valid
   */
  async verify<T extends object = IJwtPayload>(type: TokenType, token: string): Promise<T> {
    const jwtService = this.getJwtService(type)
    return jwtService.verifyAsync<T>(token)
  }

  /**
   * Extract the JWT token from the request headers.
   * @param req The incoming request object (express.Request)
   * @returns The extracted JWT token or null if not found
   */
  extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization

    if (!authHeader || typeof authHeader !== 'string') return null

    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token || token.trim() === '') return null

    return token.trim()
  }

  /**
   * Decode a JWT token
   * @param token The JWT token to decode
   * @returns The decoded payload or null if invalid
   */
  decode(token: string): IJwtPayload | null {
    try {
      const decoded = this.getJwtService(TOKEN_TYPES.ACCESS).decode<IJwtPayload | null>(token)
      return decoded ? decoded : null
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
