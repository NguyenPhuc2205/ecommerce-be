// ================================================================
// TypeORM Codes Enum
// ================================================================
/**
 * TypeOrm Error.
 *
 * @references https://github.com/typeorm/typeorm/tree/master/src/error
 */
export enum TypeORMErrorType {
  QUERY_FAILED = 'QueryFailedError',
  ENTITY_NOT_FOUND = 'EntityNotFoundError',
  CONNECTION_NOT_FOUND = 'ConnectionNotFoundError',
  CANNOT_CONNECT = 'CannotConnectAlreadyConnectedError',
  DUPLICATE_KEY = 'DuplicateKeyError',
  OPTIMISTIC_LOCK_VERSION = 'OptimisticLockVersionMismatchError',
  PESSIMISTIC_LOCK = 'PessimisticLockTransactionRequiredError',
  NO_METADATA = 'NoNeedToReleaseEntityManagerError',
  TRANSACTION_REQUIRED = 'TransactionRequiredError',
}
