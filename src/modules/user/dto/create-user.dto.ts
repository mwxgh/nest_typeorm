import { Transform } from 'class-transformer'
import {
  EntityConstant,
  RoleEnum,
  UserLockedEnum,
  UserStatusEnum,
} from '@/constants'
import { EnumField, StringField } from '@/shared/decorators'

export class CreateUserDto {
  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly lastName: string

  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly firstName: string

  @EnumField(() => RoleEnum)
  readonly role: RoleEnum

  @EnumField(() => UserStatusEnum)
  readonly status: UserStatusEnum

  @EnumField(() => UserLockedEnum)
  @Transform(({ obj }) =>
    obj.status === UserStatusEnum.Inactive
      ? UserLockedEnum.Locked
      : obj.isLocked,
  )
  readonly isLocked: UserLockedEnum
}
