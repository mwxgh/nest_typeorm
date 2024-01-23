import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { UserService } from '../services/user.service'
import { CreateUserDto, UserDto, UsersPageOptionsDto } from '../dto'
import { AllRoles, RoleEnum } from '@/constants'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'
import { Auth } from '@/modules/auth/decorators/auth.decorator'
import { ApiAuth, ApiPageOkResponse, CurrentUserId } from '@/shared/decorators'
import { PageDto } from '@/shared/common/dto/page.dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Auth(RoleEnum.BaseAdmin)
  @ApiCreatedResponse({
    description: 'Create user successfully',
  })
  @ApiAuth(undefined, { summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  async create(
    @CurrentUserId() userId: number,
    @Body() body: CreateUserDto,
  ): Promise<void> {
    return this.userService.createUser(userId, body)
  }

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(PageDto<UserDto>, { summary: 'Find user with pagination' })
  @ApiPageOkResponse({
    description: 'Get user list',
    summary: 'Get user list',
    type: PageDto<UserDto>,
  })
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
