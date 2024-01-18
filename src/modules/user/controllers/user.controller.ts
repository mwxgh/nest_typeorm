import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiParam, ApiTags } from '@nestjs/swagger'
import { UserService } from '../services/user.service'
import { UserDto, UsersPageOptionsDto } from '../dto'
import { AllRoles } from '@/constants'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'
import { Auth } from '@/modules/auth/decorators/auth.decorator'
import { ApiAuth } from '@/shared/decorators'
import { PageDto } from '@/shared/common/dto/page.dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Auth(...AllRoles)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiAuth(UserDto, { summary: 'Find user by id' })
  getAll(@Query() query: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    return this.userService.getUsersPaginate(query)
  }

  @Get(':id')
  @Auth(...AllRoles)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiAuth(UserDto, { summary: 'Find user by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<UserDto> {
    return this.userService.getUserById(id)
  }
}
