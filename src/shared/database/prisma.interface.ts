import { Prisma } from '@prisma/client'

/**
 * Options for configuring a database transaction.
 * Includes settings for maximum wait time, timeout duration, and isolation level.
 *
 * @property {number} [maxWait] - Maximum time in milliseconds to wait for acquiring a transaction connection.
 * @property {number} [timeout] - Maximum time in milliseconds for the transaction to complete before timing out.
 * @property {Prisma.TransactionIsolationLevel} [isolationLevel] - The isolation level for the transaction.
 */
export interface TransactionOptions {
  maxWait?: number
  timeout?: number
  isolationLevel?: Prisma.TransactionIsolationLevel
}
