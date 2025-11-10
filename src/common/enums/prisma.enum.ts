// ================================================================
// Prisma Error Codes Enum
// ================================================================
/**
 * Prisma Error Codes.
 * - Prisma uses specific error codes to indicate various types of errors, namespaced by their categories.
 * - This enum provides a comprehensive list of these error codes for easier reference and handling in the application.
 *
 * @references Complete list: https://www.prisma.io/docs/reference/api-reference/error-reference
 */
export enum PrismaErrorCode {
  // ==============================================================
  // COMMON ERRORS (P1xxx)
  // ==============================================================
  /** Authentication failed against database server */
  AUTHENTICATION_FAILED = 'P1000',

  /** Can't reach database server */
  CONNECTION_ERROR = 'P1001',

  /** Database server reached but timed out */
  CONNECTION_TIMEOUT = 'P1002',

  /** Database does not exist */
  DATABASE_NOT_EXIST = 'P1003',

  /** Operations timed out */
  OPERATION_TIMEOUT = 'P1008',

  /** Database already exists */
  DATABASE_ALREADY_EXISTS = 'P1009',

  /** User denied access on database */
  ACCESS_DENIED = 'P1010',

  /** Error opening TLS connection */
  TLS_CONNECTION_ERROR = 'P1011',

  /** Schema validation error */
  SCHEMA_VALIDATION_ERROR = 'P1012',

  /** Invalid database string */
  INVALID_DATABASE_STRING = 'P1013',

  /** Underlying model does not exist */
  MODEL_NOT_EXIST = 'P1014',

  /** Database version not supported */
  DATABASE_VERSION_NOT_SUPPORTED = 'P1015',

  /** Incorrect number of parameters in raw query */
  INCORRECT_PARAMETERS = 'P1016',

  /** Server closed connection */
  CONNECTION_CLOSED = 'P1017',

  // ==============================================================
  // PRISMA CLIENT ERRORS (P2xxx)
  // ==============================================================
  /** Value too long for column type */
  VALUE_TOO_LONG = 'P2000',

  /** Record not found in where condition */
  RECORD_NOT_FOUND = 'P2001',

  /** Unique constraint failed */
  UNIQUE_CONSTRAINT = 'P2002',

  /** Foreign key constraint failed */
  FOREIGN_KEY_CONSTRAINT = 'P2003',

  /** Constraint failed on database */
  CONSTRAINT_FAILED = 'P2004',

  /** Invalid value stored in database */
  INVALID_STORED_VALUE = 'P2005',

  /** Invalid provided value */
  INVALID_VALUE = 'P2006',

  /** Data validation error */
  DATA_VALIDATION_ERROR = 'P2007',

  /** Failed to parse query */
  QUERY_PARSING_ERROR = 'P2008',

  /** Failed to validate query */
  QUERY_VALIDATION_ERROR = 'P2009',

  /** Raw query failed */
  RAW_QUERY_FAILED = 'P2010',

  /** Null constraint violation */
  NULL_CONSTRAINT = 'P2011',

  /** Missing required value */
  REQUIRED_FIELD_MISSING = 'P2012',

  /** Missing required argument */
  MISSING_REQUIRED_ARGUMENT = 'P2013',

  /** Required relation violation */
  DEPENDENT_RECORDS = 'P2014',

  /** Related record not found */
  RELATED_RECORD_NOT_FOUND = 'P2015',

  /** Query interpretation error */
  QUERY_INTERPRETATION_ERROR = 'P2016',

  /** Records not connected */
  RECORDS_NOT_CONNECTED = 'P2017',

  /** Required connected records not found */
  REQUIRED_CONNECTED_RECORDS_NOT_FOUND = 'P2018',

  /** Input error */
  INPUT_ERROR = 'P2019',

  /** Value out of range */
  VALUE_OUT_OF_RANGE = 'P2020',

  /** Table does not exist */
  TABLE_NOT_EXIST = 'P2021',

  /** Column does not exist */
  COLUMN_NOT_EXIST = 'P2022',

  /** Inconsistent column data */
  INCONSISTENT_COLUMN_DATA = 'P2023',

  /** Connection pool timeout */
  CONNECTION_POOL_TIMEOUT = 'P2024',

  /** Operation failed - required records not found */
  OPERATION_FAILED_RECORDS_NOT_FOUND = 'P2025',

  /** Feature not supported by database provider */
  FEATURE_NOT_SUPPORTED = 'P2026',

  /** Multiple errors occurred */
  MULTIPLE_ERRORS = 'P2027',

  /** Transaction API error */
  TRANSACTION_ERROR = 'P2028',

  /** Query parameter limit exceeded */
  QUERY_PARAMETER_LIMIT_EXCEEDED = 'P2029',

  /** Fulltext index not found */
  FULLTEXT_INDEX_NOT_FOUND = 'P2030',

  /** MongoDB replica set required */
  MONGODB_REPLICA_SET_REQUIRED = 'P2031',

  /** Number doesn't fit in 64-bit signed integer */
  NUMBER_OUT_OF_RANGE = 'P2033',

  /** Write conflict or deadlock */
  WRITE_CONFLICT = 'P2034',

  /** Assertion violation */
  ASSERTION_VIOLATION = 'P2035',

  /** External connector error */
  EXTERNAL_CONNECTOR_ERROR = 'P2036',

  /** Too many database connections */
  TOO_MANY_CONNECTIONS = 'P2037',

  // ==============================================================
  // PRISMA MIGRATE ERRORS (P3xxx)
  // ==============================================================
  /** Failed to create database */
  MIGRATE_DATABASE_CREATE_FAILED = 'P3000',

  /** Migration with destructive changes */
  MIGRATE_DESTRUCTIVE_CHANGES = 'P3001',

  /** Migration rolled back */
  MIGRATE_ROLLBACK = 'P3002',

  /** Migration format changed */
  MIGRATE_FORMAT_CHANGED = 'P3003',

  /** System database cannot be altered */
  MIGRATE_SYSTEM_DATABASE = 'P3004',

  /** Database schema not empty */
  MIGRATE_SCHEMA_NOT_EMPTY = 'P3005',

  /** Migration failed on shadow database */
  MIGRATE_SHADOW_DATABASE_FAILED = 'P3006',

  /** Preview features not allowed */
  MIGRATE_PREVIEW_FEATURES_BLOCKED = 'P3007',

  /** Migration already applied */
  MIGRATE_ALREADY_APPLIED = 'P3008',

  /** Failed migrations found */
  MIGRATE_FAILED_MIGRATIONS = 'P3009',

  /** Migration name too long */
  MIGRATE_NAME_TOO_LONG = 'P3010',

  /** Migration not applied */
  MIGRATE_NOT_APPLIED = 'P3011',

  /** Migration not in failed state */
  MIGRATE_NOT_IN_FAILED_STATE = 'P3012',

  /** Datasource provider arrays not supported */
  MIGRATE_PROVIDER_ARRAYS_NOT_SUPPORTED = 'P3013',

  /** Shadow database creation failed */
  MIGRATE_SHADOW_DATABASE_CREATE_FAILED = 'P3014',

  /** Migration file not found */
  MIGRATE_FILE_NOT_FOUND = 'P3015',

  /** Database reset failed */
  MIGRATE_RESET_FAILED = 'P3016',

  /** Migration not found */
  MIGRATE_NOT_FOUND = 'P3017',

  /** Migration failed to apply */
  MIGRATE_FAILED_TO_APPLY = 'P3018',

  /** Datasource provider mismatch */
  MIGRATE_PROVIDER_MISMATCH = 'P3019',

  /** Shadow database disabled on Azure SQL */
  MIGRATE_AZURE_SQL_SHADOW_DISABLED = 'P3020',

  /** Foreign keys not supported */
  MIGRATE_FOREIGN_KEYS_NOT_SUPPORTED = 'P3021',

  /** Direct DDL execution disabled */
  MIGRATE_DIRECT_DDL_DISABLED = 'P3022',

  /** Fully qualified identifiers required */
  MIGRATE_FULLY_QUALIFIED_IDENTIFIERS_REQUIRED = 'P3023',

  /** Simple identifiers required */
  MIGRATE_SIMPLE_IDENTIFIERS_REQUIRED = 'P3024',

  // ==============================================================
  // PRISMA DB PULL ERRORS (P4xxx)
  // ==============================================================
  /** Introspection failed */
  INTROSPECTION_FAILED = 'P4000',

  /** Introspected database empty */
  INTROSPECTION_DATABASE_EMPTY = 'P4001',

  /** Introspected schema inconsistent */
  INTROSPECTION_SCHEMA_INCONSISTENT = 'P4002',

  // ==============================================================
  // PRISMA ACCELERATE ERRORS (P5xxx, P6xxx)
  // ==============================================================
  /** Too many requests */
  TOO_MANY_REQUESTS = 'P5011',

  /** Generic server error */
  ACCELERATE_SERVER_ERROR = 'P6000',

  /** Invalid data source */
  ACCELERATE_INVALID_DATASOURCE = 'P6001',

  /** Unauthorized */
  ACCELERATE_UNAUTHORIZED = 'P6002',

  /** Plan limit reached */
  ACCELERATE_PLAN_LIMIT_REACHED = 'P6003',

  /** Query timeout */
  ACCELERATE_QUERY_TIMEOUT = 'P6004',

  /** Invalid parameters */
  ACCELERATE_INVALID_PARAMETERS = 'P6005',

  /** Version not supported */
  ACCELERATE_VERSION_NOT_SUPPORTED = 'P6006',

  /** Connection/Engine start error */
  ACCELERATE_CONNECTION_ERROR = 'P6008',

  /** Response size limit exceeded */
  ACCELERATE_RESPONSE_SIZE_LIMIT = 'P6009',

  /** Project disabled */
  ACCELERATE_PROJECT_DISABLED = 'P6010',
}
