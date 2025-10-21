import { PrismaService } from '@/shared/database/prisma.service'
import { ITXClientDenyList } from '@prisma/client/runtime/library'

/**
 * Prisma client type for transactions.
 * Represents a subset of PrismaService methods for use within transactions.
 *
 * Derived from {@link PrismaService}
 * Omits connection-level and lifecycle methods (`$connect`, `$disconnect`, `$on`, `$transaction`, `$use`, `$extends`)
 * that are not available or should not be called within a transaction context.
 */
export type PrismaTransactionClient = Omit<PrismaService, ITXClientDenyList>
