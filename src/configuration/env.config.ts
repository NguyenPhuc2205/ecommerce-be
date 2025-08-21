import { EnvConfigManager } from 'src/configuration/env-config.manager'

export const validateEnvironmentConfig = () => {
  return EnvConfigManager.getInstance().loadValidatedEnvironmentConfig()
}
