import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { RoleList, UserLockedEnum, UserStatusEnum } from '@/constants'
import { AbstractDtoWithCU } from '@/shared/common/dto/abstract.dto'
import { User } from '../entities/user.entity'

export class UserDto extends AbstractDtoWithCU {
  @Expose()
  @ApiProperty()
  username: string

  @Expose()
  @ApiProperty()
  name: string

  @Expose()
  @ApiProperty()
  email: string

  @Expose()
  @ApiProperty()
  role: string

  @Expose()
  @ApiProperty()
  isLocked: UserLockedEnum

  @Expose()
  @ApiProperty()
  status: UserStatusEnum

  @Expose()
  @ApiProperty()
  createdAt: Date

  constructor(user: User) {
    super(user)

    this.username = user.username
    this.name = user.firstName + ' ' + user.lastName
    this.email = user.email
    this.role = RoleList[user.role]
    this.status = user.status
    this.isLocked = user.isLocked
  }
}
