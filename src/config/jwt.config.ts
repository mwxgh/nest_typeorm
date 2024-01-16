import { JwtModuleAsyncOptions } from '@nestjs/jwt'
import { ExtractJwt } from 'passport-jwt'
import config from './config'

const jwtOption = config().jwt

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: async () => ({
    secret: jwtOption.secret,
    privateKey: jwtOption.privateKey,
    signOptions: {
      expiresIn: jwtOption.ttl,
      algorithm: 'HS256',
    },
  }),
}

export const jwtStrategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: jwtOption.secret,
}
