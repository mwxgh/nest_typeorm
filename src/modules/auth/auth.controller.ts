import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import {
  ApiBadRequestResponseWrap,
  ApiPublic,
  CurrentUserId,
  Public,
} from '@/shared/decorators'
import { ValidationCustomLogicMessage } from '@/messages'
import { LoginResponseDto, UserLoginDto, UserSignUpDto } from './dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @Public()
  @ApiPublic(LoginResponseDto, { summary: 'Sign up' })
  @ApiBody({ type: UserSignUpDto })
  @ApiBadRequestResponseWrap({ message: ValidationCustomLogicMessage.signUpFail })
  async signUp(@Body() data: UserSignUpDto): Promise<LoginResponseDto> {
    return this.authService.signUp(data)
  }

  @Post('/login')
  @Public()
  @ApiPublic(LoginResponseDto, { summary: 'Login' })
  @ApiBody({ type: UserLoginDto })
  @ApiBadRequestResponseWrap({ message: ValidationCustomLogicMessage.loginFail })
  async login(@Body() data: UserLoginDto): Promise<LoginResponseDto> {
    return this.authService.login(data)
  }

  @Delete('/logout')
  @ApiPublic(undefined, { summary: 'Logout' })
  async logout(@CurrentUserId() userId: number): Promise<void> {
    return this.authService.logout(userId)
  }
}
