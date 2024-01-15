import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserLoginDto } from '../dto/user-login.dto'
import { UserService } from '@/modules/user/services/user.service'
import * as bcrypt from 'bcrypt'
import { LoginFailException } from '@/exceptions'
import { JwtService } from '@nestjs/jwt'
import { pick } from 'lodash'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() data: UserLoginDto): Promise<any> {
    const { username, password } = data

    const user = await this.userService.findUserActive({ username })

    if (!user) {
      throw new LoginFailException()
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      throw new LoginFailException()
    }

    console.log(passwordValid, 'here___________', this.jwtService)

    return {
      token: this.jwtService.sign(pick(user, ['id', 'username'])),
    }
  }
}
