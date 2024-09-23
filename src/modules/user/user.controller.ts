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
import { ApiAuth, ApiPageOkResponse, CurrentUser } from '@/shared/decorators'
import { PageDto } from '@/shared/common/dto/page.dto'
import { UserProp } from '@/shared/interfaces'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Auth(RoleEnum.BaseAdmin, RoleEnum.Supervisor, RoleEnum.Operator)
  @ApiAuth(undefined, { summary: 'Create new user' })
  create(
    @CurrentUser() userProp: UserProp,
    @Body() body: CreateUserDto,
  ): Promise<void> {
    return this.userService.customCreate({ userProp, body })
  }

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(PageDto<UserDto>, { summary: 'Get user with pagination' })
  @ApiPageOkResponse({
    description: 'Get user list',
    summary: 'Get user list',
    type: PageDto<UserDto>,
  })
  getAll(
    @Query() query: UsersPageOptionsDto,
    @CurrentUser() userProp: UserProp,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getWithPaginate(query, userProp)
  }

  @Get(':id')
  @Auth(...AllRoles)
  @ApiAuth(UserDto, { summary: 'Get user detail by id' })
  get(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUser() userProp: UserProp,
  ): Promise<UserDto> {
    return this.userService.getById({ id, userProp })
  }

  @Put(':id')
  @Auth(RoleEnum.BaseAdmin, RoleEnum.Supervisor, RoleEnum.Operator)
  @ApiAuth(undefined, { summary: 'Update user by id' })
  update(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUser() userProp: UserProp,
    @Body() body: UpdateUserDto,
  ): Promise<void> {
    return this.userService.customUpdate({ id, userProp, body })
  }

  @Delete(':id')
  @Auth(RoleEnum.BaseAdmin, RoleEnum.Supervisor, RoleEnum.Operator)
  @ApiAuth(undefined, { summary: 'Delete user by id' })
  delete(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUser() userProp: UserProp,
  ): Promise<void> {
    return this.userService.deleteBy({ id, userProp })
  }
}
