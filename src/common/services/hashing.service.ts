import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'

@Injectable()
export class HashingService {
  private saltRounds = 10

  hash(data: string): string {
    return bcrypt.hashSync(data, this.saltRounds)
  }

  compare(data: string, hashedData: string): boolean {
    return bcrypt.compareSync(data, hashedData)
  }
}
