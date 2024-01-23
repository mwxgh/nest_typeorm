import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
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
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @Public()
  @ApiPublic(LoginResponseDto, { summary: 'Sign up' })
  @ApiBody({ type: UserSignUpDto })
  @ApiBadRequestResponseWrap({ message: ValidationMessage.signUpFail })
  async signUp(@Body() data: UserSignUpDto): Promise<LoginResponseDto> {
    return this.authService.signUp(data)
  }

  @Post('/login')
  @Public()
  @ApiPublic(LoginResponseDto, { summary: 'Login' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @ApiBadRequestResponseWrap({ message: ValidationMessage.loginFail })
  async login(@Body() data: UserLoginDto): Promise<LoginResponseDto> {
    return this.authService.login(data)
  }
}
