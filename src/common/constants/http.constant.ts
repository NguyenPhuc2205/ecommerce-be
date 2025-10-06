export const CUSTOM_HEADER_KEY = {
  TRACE_ID: 'x-trace-id',
} as const

export type CustomHeaderKey = (typeof CUSTOM_HEADER_KEY)[keyof typeof CUSTOM_HEADER_KEY]

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

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS]
