import { SetMetadata } from '@nestjs/common'

/**
 * Key for the public route metadata.
 */
export const IS_PUBLIC_KEY = 'isPublic'

/**
 * Decorator to mark a route as public (no authentication required).
 * @returns {MethodDecorator}
 */
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true)
