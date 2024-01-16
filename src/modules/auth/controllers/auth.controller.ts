import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { UserService } from '@/modules/user/services/user.service'
import { SignUpFailException } from '@/exceptions'
import { AuthService } from '../services/auth.service'
import {
  ApiBadRequestResponseWrap,
  ApiPublic,
  Public,
} from '@/shared/decorators'
import { ValidationMessage } from '@/messages'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { LoginResponseDto, UserLoginDto, UserSignUpDto } from '../dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/sign-up')
  @Public()
  @ApiPublic(LoginResponseDto, { summary: 'Sign up' })
  @ApiBody({ type: UserSignUpDto })
  @ApiBadRequestResponseWrap({ message: ValidationMessage.signUpFail })
  async signUp(@Body() data: UserSignUpDto): Promise<LoginResponseDto> {
    const { username } = data
    const user = await this.userService.findUserActive({ username })

    if (user) {
      throw new SignUpFailException()
    }

    return this.authService.signUp(data)
  }

  @Post('/login')
  @Public()
  @ApiPublic(LoginResponseDto, { summary: 'Login' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @ApiBadRequestResponseWrap({ message: ValidationMessage.loginFail })
  async login(@Body() data: UserLoginDto): Promise<LoginResponseDto> {
    const { username, password } = data

    const user = await this.authService.validateUser(username, password)

    return this.authService.login(user)
  }
}
