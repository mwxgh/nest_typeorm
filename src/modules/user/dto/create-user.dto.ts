import { Transform } from 'class-transformer'
import {
  EntityConstant,
  RoleEnum,
  UserLockedEnum,
  BaseStatusEnum,
} from '@/constants'
import {
  EnumField,
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/shared/decorators'

export class CreateUserDto {
  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly lastName: string

  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly firstName: string

  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly username: string

  @StringFieldOptional({ maxLength: EntityConstant.EntityShortLength })
  readonly email: string

  @EnumField(() => RoleEnum)
  readonly role: RoleEnum

  @EnumFieldOptional(() => BaseStatusEnum)
  readonly status: BaseStatusEnum

  @EnumFieldOptional(() => UserLockedEnum)
  @Transform(({ obj }) =>
    obj.status === BaseStatusEnum.Inactive
      ? UserLockedEnum.Locked
      : obj.isLocked,
  )
  readonly isLocked: UserLockedEnum
}
