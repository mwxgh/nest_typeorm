import { Body, Controller, Delete, Get, Put } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { ApiTags } from '@nestjs/swagger'
import { ApiAuth, CurrentUser } from '@/shared/decorators'
import { UserProp } from '@/shared/interfaces'
import { UserDto } from '../user/dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { AllRoles } from '@/constants'
import { UpdateProfileDto } from './dto/update-profile.dto'

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(UserDto, { summary: 'Get profile detail' })
  get(@CurrentUser() userProp: UserProp): Promise<Partial<UserDto>> {
    return this.userService.getProfile({ userProp })
  }

  @Put()
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Update profile' })
  update(
    @CurrentUser() userProp: UserProp,
    @Body() body: UpdateProfileDto,
  ): Promise<void> {
    return this.userService.updateProfile({ userProp, body })
  }

  @Delete()
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Delete profile' })
  delete(@CurrentUser() userProp: UserProp): Promise<void> {
    return this.userService.deleteProfile({ userProp })
  }
}
