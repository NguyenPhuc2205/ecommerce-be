import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { XApiKeyGuard } from 'src/common/guards/x-api-key.guard'
import { AuthRepository } from 'src/modules/auth/auth.repository'
import { UsersModule } from 'src/modules/users/users.module'

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtAuthGuard, XApiKeyGuard],
  exports: [AuthService, JwtAuthGuard, XApiKeyGuard],
})
export class AuthModule {}
