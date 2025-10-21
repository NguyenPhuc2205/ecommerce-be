import { Module } from '@nestjs/common'
import { PrismaService } from '@/shared/database/prisma.service'
import { TransactionService } from '@/shared/database/transaction.service'

@Module({
  providers: [PrismaService, TransactionService],
  exports: [PrismaService, TransactionService],
})
export class DatabaseModule {}
