import { Injectable } from '@nestjs/common'
import { Prisma, VerificationCode } from '@prisma/client'
import { PrismaService } from '@/shared/database/prisma.service'
import { PrismaTransactionClient } from '@/common/types'
import { VerificationCodeType } from '@/common/constants'

@Injectable()
export class VerificationCodesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // ================================================================
  // SELECT CONFIGURATIONS
  // ================================================================
  private readonly defaultSelect = {
    id: true,
    identifier: true,
    code: true,
    type: true,
    attempts: true,
    maxAttempts: true,
    isUsed: true,
    resendCount: true,
    deliveryMethod: true,
    userId: true,
    expiresAt: true,
    createdAt: true,
    updatedAt: true,
    usedAt: true,
  } as const satisfies Prisma.VerificationCodeSelect

  // ================================================================
  // CREATE OPERATIONS
  // ================================================================
  /**
   * Create a new verification code record.
   *
   * @param data payload to create the verification code
   * @param tx optional transaction client
   * @returns the created verification code
   */
  async create(
    data: Prisma.VerificationCodeCreateInput,
    select?: Prisma.VerificationCodeSelect | null,
    tx?: PrismaTransactionClient,
  ): Promise<VerificationCode> {
    const client = this.getClient(tx)
    return await client.verificationCode.create({ data, select: select ?? this.defaultSelect })
  }

  async createMany(
    data: Prisma.VerificationCodeCreateManyInput[],
    options?: { skipDuplicates?: boolean },
    tx?: PrismaTransactionClient,
  ) {
    const client = this.getClient(tx)
    return await client.verificationCode.createMany({
      data,
      skipDuplicates: options?.skipDuplicates ?? false,
    })
  }

  // ================================================================
  // READ OPERATIONS
  // ================================================================
  async findUnique(
    unique: Prisma.VerificationCodeWhereUniqueInput,
    select?: Prisma.VerificationCodeSelect | null,
    tx?: PrismaTransactionClient,
  ): Promise<VerificationCode | null> {
    const client = this.getClient(tx)
    return await client.verificationCode.findUnique({
      where: unique,
      select: select ?? this.defaultSelect,
    })
  }

  async findById(
    id: number,
    tx?: PrismaTransactionClient,
    select?: Prisma.VerificationCodeSelect | null,
  ): Promise<VerificationCode | null> {
    const condition: Prisma.VerificationCodeWhereUniqueInput = { id }
    return await this.findUnique(condition, select, tx)
  }

  async findFirst(
    where: Prisma.VerificationCodeWhereInput,
    select?: Prisma.VerificationCodeSelect,
    orderBy?: Prisma.VerificationCodeOrderByWithRelationInput,
    tx?: PrismaTransactionClient,
  ) {
    const client = this.getClient(tx)
    return await client.verificationCode.findFirst({
      where,
      select: select ?? this.defaultSelect,
      orderBy,
    })
  }

  async findByCode(
    identifier: string,
    code: string,
    type: VerificationCodeType,
    select?: Prisma.VerificationCodeSelect,
    tx?: PrismaTransactionClient,
  ): Promise<VerificationCode | null> {
    const client = this.getClient(tx)
    return await client.verificationCode.findFirst({
      where: { identifier, code, type },
      select: select ?? this.defaultSelect,
      orderBy: { createdAt: 'desc' },
    })
  }

  // ================================================================
  // UPDATE OPERATIONS
  // ================================================================
  async update(
    where: Prisma.VerificationCodeWhereUniqueInput,
    data: Prisma.VerificationCodeUpdateInput,
    select?: Prisma.VerificationCodeSelect,
    tx?: PrismaTransactionClient,
  ): Promise<VerificationCode> {
    const client = this.getClient(tx)
    return await client.verificationCode.update({
      where: where,
      data: data,
      select: select ?? this.defaultSelect,
    })
  }

  async updateById(
    id: number,
    data: Prisma.VerificationCodeUpdateInput,
    select?: Prisma.VerificationCodeSelect,
    tx?: PrismaTransactionClient,
  ): Promise<VerificationCode> {
    return await this.update({ id }, data, select, tx)
  }

  async incrementAttempts(id: number, tx?: PrismaTransactionClient): Promise<VerificationCode> {
    const client = this.getClient(tx)
    return await client.verificationCode.update({
      where: { id },
      data: {
        attempts: { increment: 1 },
      },
    })
  }

  async markAsUsed(id: number, tx?: PrismaTransactionClient): Promise<VerificationCode> {
    const client = this.getClient(tx)
    return await client.verificationCode.update({
      where: { id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    })
  }

  // ================================================================
  // DELETE FUNCTIONS
  // ================================================================
  async cleanupExpiredCodes(tx?: PrismaTransactionClient): Promise<Prisma.BatchPayload> {
    const client = this.getClient(tx)
    return await client.verificationCode.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    })
  }

  // ================================================================
  // HELPER FUNCTIONS
  // ================================================================
  private getClient(tx?: PrismaTransactionClient) {
    return tx ?? this.prismaService
  }
}
