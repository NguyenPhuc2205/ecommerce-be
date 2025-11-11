import { Prisma } from '@prisma/client'

/**
 * Default Prisma transaction configuration options.
 *
 * Provides standardized settings for database transactions to ensure
 * consistency, reliability, and optimal performance across the application.
 * These defaults balance transaction safety with reasonable timeout limits.
 *
 * @property {number} MAX_WAIT - Maximum time in milliseconds to wait for acquiring a transaction connection from the pool. Default: 5000ms (5 seconds)
 * @property {number} TIMEOUT - Maximum time in milliseconds for the entire transaction to complete before timing out. Default: 30000ms (30 seconds)
 * @property {Prisma.TransactionIsolationLevel} ISOLATION_LEVEL - Default transaction isolation level. Default: ReadCommitted
 *
 * @see {@link https://www.prisma.io/docs/concepts/components/prisma-client/transactions | Prisma Transactions Documentation}
 * @see {@link Prisma.TransactionIsolationLevel} for available isolation levels
 */
export const PRISMA_DEFAULTS = {
  /** Maximum time in milliseconds to wait for acquiring a transaction connection. */
  MAX_WAIT: 5000,

  /** Maximum time in milliseconds for the transaction to complete before timing out. */
  TIMEOUT: 30000,

  /** The isolation level for the transaction. */
  ISOLATION_LEVEL: Prisma.TransactionIsolationLevel.ReadCommitted,
} as const

export type PrismaDefaultKey = keyof typeof PRISMA_DEFAULTS

export type PrismaDefault = (typeof PRISMA_DEFAULTS)[keyof typeof PRISMA_DEFAULTS] // [...]: all valid index of PRISMA_DEFAULTS & create union type
