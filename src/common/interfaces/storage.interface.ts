export interface IThrottlerStorageConfig {
  type: 'memory' | 'redis'
  options?: {
    ttl?: number
    max?: number
  }
}
