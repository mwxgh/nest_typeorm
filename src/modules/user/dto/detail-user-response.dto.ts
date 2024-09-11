import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { UserLockedEnum, BaseStatusEnum } from '@/constants'

export class DetailUserResponseDto {
  @Expose()
  @ApiProperty()
  id: number

  @Expose()
  @ApiProperty()
  username: string

  @Expose()
  @ApiProperty()
  firstName: string

  @Expose()
  @ApiProperty()
  lastName: string

  @Expose()
  @ApiProperty()
  role: string

  @Expose()
  @ApiProperty()
  email: string

  @Expose()
  @ApiProperty()
  status: BaseStatusEnum

  @Expose()
  @ApiProperty()
  isLocked: UserLockedEnum
}
