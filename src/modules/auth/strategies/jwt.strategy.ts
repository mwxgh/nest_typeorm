import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtStrategyConfig } from '@/config/jwt.config'
import { JwtStrategyDto } from '../dto'
import { UserService } from '@/modules/user/user.service'
import { User } from '@/modules/user/entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super(jwtStrategyConfig)
  }

  async validate(payload: JwtStrategyDto): Promise<User> {
    const user = this.userService.findOneByOrFail({ id: payload.sub })

    return user
  }
}
