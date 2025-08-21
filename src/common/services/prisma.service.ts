import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['info'],
    })
  }

  /**
   * Called when the module is initialized.
   * Connects to the database.
   */
  async onModuleInit() {
    await this.$connect()
  }
}
