import { Module } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { LocalStrategy } from './strategies/local.strategy'
import { AuthController } from './controllers/auth.controller'
import { jwtConfig } from '@/config/jwt.config'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
  ],
  providers: [AuthService, JwtService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
