import { Module } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { LocalStrategy } from './strategies/local.strategy'
import { AuthController } from './controllers/auth.controller'
import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env' })

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('APP_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT_TTL'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
