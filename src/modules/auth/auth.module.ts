import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AccessTokenStrategy } from './strategies/accessToken.strategy'
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy.ts'

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.register({})
  ],
  providers: [AuthService, JwtService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
