import { EnvConfig } from '@/configuration/env.schema'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bcrypt from 'bcrypt'

@Injectable()
export class HashingService {
  private saltRounds: number

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', { infer: true }) as number
  }

  /**
   * Hashes the given data using bcrypt.
   * @param data The data to hash.
   * @returns The hashed data.
   */
  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds)
  }

  /**
   * Compares the given data with the hashed data using bcrypt.
   * @param data The data to compare.
   * @param hashedData The hashed data to compare with.
   * @returns True if the data matches the hashed data, false otherwise.
   */
  async compare(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData)
  }
}
