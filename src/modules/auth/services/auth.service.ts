import { LoginFailException } from '@/exceptions'
import { User } from '@/modules/user/entities/user.entity'
import { UserService } from '@/modules/user/services/user.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { plainToInstance } from 'class-transformer'
import * as bcrypt from 'bcrypt'
import {
  AppConstant,
  RoleEnum,
} from '@/constants'
import { JwtStrategyDto, LoginResponseDto, UserSignUpDto } from '../dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findUserActive({ username })

    if (!user) {
      throw new LoginFailException()
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      throw new LoginFailException()
    }

    return user
  }

  async signUp(data: UserSignUpDto): Promise<LoginResponseDto> {
    const user: User = this.userService.createEntity({
      ...data,
      password: bcrypt.hashSync(
        data.password,
        bcrypt.genSaltSync(AppConstant.saltOrRounds),
      ),
      role: RoleEnum.NormalUser,
      createdBy: AppConstant.defaultUserId,
      updatedBy: AppConstant.defaultUserId,
    }) as User

    await this.userService.save(user)

    return this.login(user)
  }

  login(user: User): LoginResponseDto {
    const payload: JwtStrategyDto = {
      username: user.username,
      sub: user.id,
      role: user.role,
      email: user.email,
    }
    const token = this.jwtService.sign(payload, {
      privateKey: 'secret',
      algorithm: 'HS256',
    })

    return plainToInstance(LoginResponseDto, {
      userId: user.id,
      token,
    })
  }
}
