import { Controller, Get, Param } from '@nestjs/common'
import { ApiParam, ApiTags } from '@nestjs/swagger'
import { UserService } from '../services/user.service'
import { UserDto } from '../dto'
import { RoleEnum } from '@/constants'
import { ApiAuth } from '@/shared/decorators/http.decorator'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'
import { User } from '../entities/user.entity'
import { Auth } from '@/modules/auth/decorators/auth.decorator'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Auth(RoleEnum.NormalUser)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiAuth(UserDto, { summary: 'Find user by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<User | null> {
    console.log('here________________________')

    return this.userService.findOneBy({ id })
  }
}
