import { TransactionOptions } from '@/common/interfaces'
import { PrismaTransactionClient } from '@/common/types'
import { PrismaService } from '@/shared/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async run<T>(callback: (tx: PrismaTransactionClient) => Promise<T>, options?: TransactionOptions): Promise<T> {
    const mergedOptions: TransactionOptions = {
      maxWait: 5000,
      timeout: 30000,
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      ...options,
    }

    return this.prismaService.$transaction(callback, mergedOptions)
  }
}
