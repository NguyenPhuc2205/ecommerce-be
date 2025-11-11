import { Prisma } from '@prisma/client'

// ================================================================
// PRISMA TRANSACTION INTERFACE
// ================================================================
/**
 * Options for configuring a database transaction.
 * Includes settings for maximum wait time, timeout duration, and isolation level.
 *
 * @property {number} [maxWait] - Maximum time in milliseconds to wait for acquiring a transaction connection.
 * @property {number} [timeout] - Maximum time in milliseconds for the transaction to complete before timing out.
 * @property {Prisma.TransactionIsolationLevel} [isolationLevel] - The isolation level for the transaction.
 *
 * @see {@link Prisma.TransactionIsolationLevel} for available isolation levels.
 * - ReadUncommitted: Allows dirty reads, non-repeatable reads, and phantom reads.
 * - ReadCommitted: Prevents dirty reads, allows non-repeatable reads and phantom reads.
 * - RepeatableRead: Prevents dirty reads and non-repeatable reads, allows phantom reads.
 * - Serializable: Prevents dirty reads, non-repeatable reads, and phantom reads.
 */
export interface ITransactionOptions {
  /** Maximum time in milliseconds to wait for acquiring a transaction connection. */
  maxWait?: number

  /** Maximum time in milliseconds for the transaction to complete before timing out. */
  timeout?: number

  /** The isolation level for the transaction. */
  isolationLevel?: Prisma.TransactionIsolationLevel
}

// ================================================================
// CUSTOM PRISMA ERROR INTERFACE
// ================================================================\
/**
 * Metadata associated with a Prisma error.
 * Includes optional fields for target, field name, column, and any additional custom metadata.
 *
 * @property {string[]} [target] - The target entities related to the error.
 * @property {string} [fieldName] - The specific field name involved in the error.
 * @property {string} [column] - The database column associated with the error.
 * @property {Record<string, unknown>} [key: string] - Additional custom metadata related to the error.
 */
export interface IPrismaErrorMetadata {
  /** The target entities related to the error. */
  target?: string[]

  /** The specific field name involved in the error. */
  fieldName?: string

  /** The database column associated with the error. */
  column?: string

  /** Additional custom metadata related to the error. */
  [key: string]: unknown
}

/**
 * Custom Prisma error interface.
 * Includes error code, message, optional metadata, and client version.
 *
 * @property {string} code - The error code.
 * @property {string} message - The error message.
 * @property {IPrismaErrorMetadata} [meta] - Optional metadata associated with the error.
 * @property {string} [clientVersion] - Optional version of the Prisma client.
 */
export interface IPrismaError {
  /** The error code. */
  code: string

  /** The error message. */
  message: string

  /** Optional metadata associated with the error. */
  meta?: unknown

  /** Optional version of the Prisma client. */
  clientVersion?: string
}
