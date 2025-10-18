import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { formatZodError } from '@/common/helpers'
import { EnvConfig, envConfigSchema } from '@/configuration/env.schema'
import { ZodError } from 'zod'
import { config } from 'dotenv'

@Injectable()
export class EnvConfigManager {
  public static instance: EnvConfigManager | null = null
  private _validatedConfig: EnvConfig | null = null

  private constructor() {}

  /**
   * Get the singleton instance of EnvConfigManager
   * @returns EnvConfigManager
   */
  public static getInstance(): EnvConfigManager {
    if (!EnvConfigManager.instance) {
      EnvConfigManager.instance = new EnvConfigManager()
    }

    return EnvConfigManager.instance
  }

  /**
   * Validate the environment configuration
   * @param config The configuration to validate
   * @returns The validated configuration and store it
   */
  public validateConfig(config: Record<string, unknown>): EnvConfig {
    // Return the validated config if it exists
    if (this._validatedConfig) {
      return this._validatedConfig
    }

    try {
      const validatedConfig = envConfigSchema.parse(config)

      // Store the validated config to reuse later
      this._validatedConfig = validatedConfig
      return this._validatedConfig
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error)
        throw new InternalServerErrorException(
          `Environment variables validation failed:\n${formattedErrors
            .map((err) => `• ${err.path}: ${err.message}`)
            .join('\n')}`,
        )
      }

      throw error
    }
  }

  /**
   * Load and validate the environment configuration
   * @returns The validated environment configuration
   */
  public loadValidatedEnvironmentConfig(): EnvConfig {
    if (!this._validatedConfig) {
      // Load .env file
      config()

      // Validate the loaded config
      this._validatedConfig = this.validateConfig(process.env)
    }

    return this._validatedConfig
  }

  /**
   * Reset the EnvConfigManager instance
   */
  static reset(): void {
    EnvConfigManager.instance = null
  }
}
