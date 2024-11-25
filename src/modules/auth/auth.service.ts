import { LoginFailException, SignUpFailException } from '@/exceptions'
import { User } from '@/modules/user/entities/user.entity'
import { UserService } from '@/modules/user/user.service'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { plainToInstance } from 'class-transformer'
import { AppConstant, RoleEnum } from '@/constants'
import {
  JwtStrategyDto,
  LoginResponseDto,
  UserLoginDto,
  UserSignUpDto,
} from './dto'
import { Logger } from 'winston'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import * as argon2 from 'argon2'
import config from '@config/config'

const { secret, ttl, refreshSecret, refreshTtl } = config().jwt

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async hashData(data: string): Promise<string> {
    return argon2.hash(data)
  }

  async validateLogin(username: string, password: string): Promise<User> {
    const user = await this.userService.findActive({ username })

    if (!user) {
      throw new LoginFailException()
    }

    const passwordValid = await argon2.verify(user.password, password)

    if (!passwordValid) {
      throw new LoginFailException()
    }

    return user
  }

  async signUp(data: UserSignUpDto): Promise<LoginResponseDto> {
    const existUser = await this.userService.findOneBy({
      username: data.username,
      email: data.email,
    })

    if (existUser) {
      throw new SignUpFailException()
    }
    const password = await this.hashData(data.password)

    const user: User = this.userService.createEntity({
      ...data,
      password,
      role: RoleEnum.NormalUser,
      refreshToken: 'newRefreshToken',
      createdBy: AppConstant.defaultUserId,
      updatedBy: AppConstant.defaultUserId,
    }) as User

    await this.userService.save(user)
    const loginResponse = await this.generateTokens(user)

    await this.updateRefreshToken(
      loginResponse.userId,
      loginResponse.refreshToken,
    )

    return loginResponse
  }

  async login(data: UserLoginDto): Promise<LoginResponseDto> {
    const user = await this.validateLogin(data.username, data.password)

    this.logger.log('Login successful', {})

    return this.generateTokens(user)
  }

  async logout(userId: number) {
    await this.userService.updateBy(userId, { refreshToken: null })
  }

  async updateRefreshToken(userId: number, newRefreshToken: string) {
    const refreshToken = await this.hashData(newRefreshToken)

    await this.userService.updateBy(userId, {
      refreshToken,
    })
  }

  async generateTokens(user: User): Promise<LoginResponseDto> {
    const payload: JwtStrategyDto = {
      username: user.username,
      sub: user.id,
      role: user.role,
      email: user.email,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: ttl,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshTtl,
      }),
    ])

    return plainToInstance(LoginResponseDto, {
      userId: user.id,
      accessToken,
      refreshToken,
    })
  }
}
