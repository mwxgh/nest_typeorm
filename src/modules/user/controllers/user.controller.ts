import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiParam, ApiTags } from '@nestjs/swagger'
import { UserService } from '../services/user.service'
import { RolesGuard } from '@/modules/auth/guards/roles.guard'
import { Roles } from '@/shared/decorators'
import { UserDto } from '../dto'
import { RoleEnum } from '@/constants'
import { ApiAuth } from '@/shared/decorators/http.decorator'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'
import { User } from '../entities/user.entity'

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Roles(RoleEnum.BaseAdmin)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiAuth(UserDto, { summary: 'Find user by id' })
  show(@Param('id', PositiveNumberPipe) id: number): Promise<User | null> {
    return this.userService.findOneBy({ id })
  }
}
