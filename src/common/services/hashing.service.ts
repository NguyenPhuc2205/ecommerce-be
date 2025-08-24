import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'

@Injectable()
export class HashingService {
  private saltRounds = 10

  /**
   * Hashes the given data using bcrypt.
   * @param data The data to hash.
   * @returns The hashed data.
   */
  hash(data: string): string {
    return bcrypt.hashSync(data, this.saltRounds)
  }

  /**
   * Compares the given data with the hashed data using bcrypt.
   * @param data The data to compare.
   * @param hashedData The hashed data to compare with.
   * @returns True if the data matches the hashed data, false otherwise.
   */
  compare(data: string, hashedData: string): boolean {
    return bcrypt.compareSync(data, hashedData)
  }
}
