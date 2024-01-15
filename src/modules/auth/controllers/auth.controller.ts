import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { UserLoginDto } from '../dto/user-login.dto'
import { UserService } from '@/modules/user/services/user.service'
import { SignUpFailException } from '@/exceptions'
import { AuthService } from '../services/auth.service'
import { LoginResponseDto } from '../dto/login-response.dto'
import { UserSignUpDto } from '../dto/user-sign-up.dto'
import { Public } from '@/shared/decorators'
import {
  ApiBadRequestResponseWrap,
  ApiPublic,
} from '@/shared/decorators/http.decorator'
import { ValidationMessage } from '@/messages'

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
  @ApiBody({ type: UserLoginDto })
  @ApiBadRequestResponseWrap({ message: ValidationMessage.loginFail })
  async login(@Body() data: UserLoginDto): Promise<LoginResponseDto> {
    const { username, password } = data

    const user = await this.authService.validateUser(username, password)

    return this.authService.login(user)
  }
}
