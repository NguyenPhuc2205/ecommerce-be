import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { EnvConfig } from '@/configuration/env.schema'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Get configService
  const configService = app.get(ConfigService<EnvConfig>)

  // Apply global api prefix
  const apiPrefix = configService.get<string>('API_PREFIX') ?? ''
  app.setGlobalPrefix(apiPrefix)

  const port = configService.get<number>('APP_PORT') as number
  await app.listen(port)
}

bootstrap().catch((error) => {
  console.error('Error during app bootstrap:', error)
  process.exit(1)
})
