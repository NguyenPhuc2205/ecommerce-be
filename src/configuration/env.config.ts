import { EnvConfigManager } from '@/configuration/env-config.manager'

export const validateEnvironmentConfig = () => {
  return EnvConfigManager.getInstance().loadValidatedEnvironmentConfig()
}
