import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UsersPageOptionsDto,
} from './dto'
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
  @ApiAuth(undefined, { summary: 'Create new user' })
  async create(
    @CurrentUserId() userId: number,
    @Body() body: CreateUserDto,
  ): Promise<void> {
    return this.userService.createUser({ userId, body })
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
  @ApiAuth(UserDto, { summary: 'Find user by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<UserDto> {
    return this.userService.getUserById(id)
  }

  @Put(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update user by id' })
  update(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateUserDto,
  ): Promise<void> {
    return this.userService.updateUserById({ id, userId, body })
  }

  @Delete(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Delete user by id' })
  delete(@Param('id', PositiveNumberPipe) id: number): Promise<void> {
    return this.userService.deleteUserById({ id })
  }
}
