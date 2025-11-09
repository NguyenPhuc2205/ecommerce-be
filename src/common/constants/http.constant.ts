// ================================================================
// CUSTOM REQUEST CONTEXT KEYS
// ================================================================
/**
 * Custom request context keys used to store and retrieve data in server (Express request object).
 * It's not show in the client side (server-side only).
 *
 * @property CURRENT_USER - Key to store the current authenticated user info.
 * @property TRACE_ID - Stores distributed trace ID.
 *
 * @example
 * - Store current user info in request context
 * request[REQUEST_CONTEXT.CURRENT_USER] = jwtPayload
 *
 * - Store trace ID in request context
 * request[REQUEST_CONTEXT.TRACE_ID] = traceId
 */
export const REQUEST_CONTEXTS = {
  /** Current authenticated user store */
  CURRENT_USER: 'currentUser',

  /** Trace ID store in request context */
  TRACE_ID: 'traceId',
} as const

export type RequestContextKey = keyof typeof REQUEST_CONTEXTS

export type RequestContext = (typeof REQUEST_CONTEXTS)[keyof typeof REQUEST_CONTEXTS]

// ================================================================
// CUSTOM HEADER KEYS
// ================================================================
/**
 * Custom HTTP header keys used in requests and responses.
 * All custom headers should be prefixed with 'X-' or 'x-' to indicate they are non-standard headers.
 *
 * @property TRACE_ID - Header key for trace ID.
 * @property REQUEST_ID - Header key for request ID.
 */
export const CUSTOM_HEADERS = {
  /** Trace ID header */
  TRACE_ID: 'x-trace-id',

  /** Request ID header */
  REQUEST_ID: 'x-request-id',

  /** API key authentication header */
  API_KEY: 'x-api-key',
} as const

export type CustomHeaderKey = keyof typeof CUSTOM_HEADERS

export type CustomHeader = (typeof CUSTOM_HEADERS)[keyof typeof CUSTOM_HEADERS]

// ================================================================
// HTTP METHODS
// ================================================================
/**
 * HTTP methods used in requests.
 *
 * @property GET - HTTP GET method.
 * @property POST - HTTP POST method.
 * @property PUT - HTTP PUT method.
 * @property DELETE - HTTP DELETE method.
 * @property PATCH - HTTP PATCH method.
 * @property OPTIONS - HTTP OPTIONS method.
 * @property HEAD - HTTP HEAD method.
 * @property TRACE - HTTP TRACE method.
 * @property CONNECT - HTTP CONNECT method.
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
  TRACE: 'TRACE',
  CONNECT: 'CONNECT',
} as const

export type HttpMethodKey = keyof typeof HTTP_METHODS

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS]
