// ================================================================
// CUSTOM TYPEORM ERROR INTERFACE
// ================================================================
/**
 * Interface representing a TypeORM error.
 *
 * @property {string} name - The name of the error.
 * @property {string} message - The error message.
 * @property {ITypeORMDriverError} [driverError] - Optional driver-specific error details.
 */
export interface ITypeORMError {
  name: string
  message: string
  driverError?: ITypeORMDriverError
}

/**
 * Interface representing driver-specific error details in TypeORM.
 *
 * @property {string} [code] - The error code, if available.
 * @property {number} [error] - The error number, if available.
 * @property {Record<string, unknown>} [key: string] - Additional driver-specific error properties.
 */
export interface ITypeORMDriverError {
  code?: string
  error?: number
  [key: string]: unknown
}
