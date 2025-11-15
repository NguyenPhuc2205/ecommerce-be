import { PRISMA_DEFAULTS } from '@/common/constants'
import { ITransactionOptions } from '@/common/interfaces'
import { PrismaTransactionClient } from '@/common/types'
import { PrismaService } from '@/shared/database/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async run<T>(callback: (tx: PrismaTransactionClient) => Promise<T>, options?: ITransactionOptions): Promise<T> {
    const mergedOptions: ITransactionOptions = {
      maxWait: PRISMA_DEFAULTS.MAX_WAIT,
      timeout: PRISMA_DEFAULTS.TIMEOUT,
      isolationLevel: PRISMA_DEFAULTS.ISOLATION_LEVEL,
      ...options,
    }

    return this.prismaService.$transaction(callback, mergedOptions)
  }
}
