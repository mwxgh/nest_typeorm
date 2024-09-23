import { JwtModuleAsyncOptions } from '@nestjs/jwt'
import { ExtractJwt } from 'passport-jwt'
import config from './config'

const { secret, privateKey, ttl } = config().jwt

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: async () => ({
    secret,
    privateKey,
    signOptions: {
      expiresIn: ttl,
      algorithm: 'HS256',
    },
  }),
}

export const jwtStrategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: secret,
}
