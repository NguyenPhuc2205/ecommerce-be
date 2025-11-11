// ================================================================
// CUSTOM REQUEST CONTEXT KEYS
// ================================================================
/**
 * Custom request context keys used to store and retrieve data in the Express request object.
 *
 * These keys are used exclusively on the server-side to attach metadata
 * and user information to incoming requests. They are not exposed to clients
 * and persist only for the duration of the request lifecycle.
 *
 * @property {string} CURRENT_USER - Key to store the current authenticated user's JWT payload information
 * @property {string} TRACE_ID - Key to store the distributed tracing identifier for request tracking
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
 *
 * All custom headers follow the 'x-' prefix convention to indicate
 * they are non-standard, application-specific headers. These headers
 * facilitate distributed tracing, request tracking, and API authentication.
 *
 * @property {string} TRACE_ID - Header key for distributed tracing identifier
 * @property {string} REQUEST_ID - Header key for unique request identifier
 * @property {string} API_KEY - Header key for API key authentication
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
 * Standard HTTP methods used in HTTP requests.
 *
 * Defines all standard HTTP request methods as specified in RFC 7231.
 * These constants ensure type safety and consistency when handling
 * different types of HTTP operations.
 *
 * @property {string} GET - HTTP GET method for retrieving resources
 * @property {string} POST - HTTP POST method for creating new resources
 * @property {string} PUT - HTTP PUT method for updating/replacing entire resources
 * @property {string} DELETE - HTTP DELETE method for removing resources
 * @property {string} PATCH - HTTP PATCH method for partially updating resources
 * @property {string} OPTIONS - HTTP OPTIONS method for describing communication options
 * @property {string} HEAD - HTTP HEAD method for retrieving headers only
 * @property {string} TRACE - HTTP TRACE method for diagnostic purposes
 * @property {string} CONNECT - HTTP CONNECT method for establishing tunnels
 */
export const HTTP_METHODS = {
  /** HTTP GET method. */
  GET: 'GET',

  /** HTTP POST method. */
  POST: 'POST',

  /** HTTP PUT method. */
  PUT: 'PUT',

  /** HTTP DELETE method. */
  DELETE: 'DELETE',

  /** HTTP PATCH method. */
  PATCH: 'PATCH',

  /** HTTP OPTIONS method. */
  OPTIONS: 'OPTIONS',

  /** HTTP HEAD method. */
  HEAD: 'HEAD',

  /** HTTP TRACE method. */
  TRACE: 'TRACE',

  /** HTTP CONNECT method. */
  CONNECT: 'CONNECT',
} as const

export type HttpMethodKey = keyof typeof HTTP_METHODS

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS]
