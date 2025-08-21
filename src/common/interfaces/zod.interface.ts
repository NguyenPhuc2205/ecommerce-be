export interface IFormattedZodError {
  path: string
  message: string
  code: string
  value?: unknown
}
