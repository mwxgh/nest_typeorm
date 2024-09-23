import { Body, Controller, Delete, Get, Patch, Put } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { ApiTags } from '@nestjs/swagger'
import { ApiAuth, CurrentUserId } from '@/shared/decorators'
import { UserDto } from '../user/dto'
import { AllRoles } from '@/constants'
import { ChangePasswordDto, UpdateProfileDto } from './dto'
import { Auth } from '../auth/decorators/auth.decorator'

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(UserDto, { summary: 'Get profile detail' })
  get(@CurrentUserId() id: number): Promise<Partial<UserDto>> {
    return this.userService.getProfile({ id })
  }

  @Put()
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Update profile' })
  update(
    @CurrentUserId() id: number,
    @Body() body: UpdateProfileDto,
  ): Promise<void> {
    return this.userService.updateProfile({ id, body })
  }

  @Patch('password')
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Update password' })
  changePassword(
    @CurrentUserId() id: number,
    @Body() body: ChangePasswordDto,
  ): Promise<void> {
    return this.userService.changePassword({ id, body })
  }

  @Delete()
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Delete yourself' })
  delete(@CurrentUserId() id: number): Promise<void> {
    return this.userService.deleteProfile({ id })
  }
}
