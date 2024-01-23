import { Exclude } from 'class-transformer'
import { Column, Entity, Index } from 'typeorm'
import {
  EntityConstant,
  RoleEnum,
  UserLockedEnum,
  UserStatusEnum,
} from '@/constants'
import { UserDto } from '@/modules/user/dto/user.dto'
import {
  AbstractEntityWithCU,
  IAbstractEntity,
} from '@/shared/common/base.entity'
import { UseDto } from '@/shared/decorators'

@Entity('users')
@UseDto(UserDto)
@Index(['email'], { unique: true })
export class User
  extends AbstractEntityWithCU<UserDto>
  implements IAbstractEntity<UserDto>
{
  @Column({
    type: 'tinyint',
    unsigned: true,
  })
  role: RoleEnum

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  firstName: string

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  lastName: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
    unique: true,
  })
  username: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  @Exclude()
  password: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
    nullable: true,
  })
  email: string

  @Column({
    name: 'session_id',
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
    nullable: true,
  })
  sessionId: string

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: UserStatusEnum.Active,
  })
  status: UserStatusEnum

  @Column({
    name: 'is_locked',
    type: 'tinyint',
    unsigned: true,
    default: UserLockedEnum.Unlocked,
  })
  isLocked: UserLockedEnum
}
