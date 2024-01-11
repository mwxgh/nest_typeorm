import {
  EntityConstant,
  RoleEnum,
  UserLockedEnum,
  UserStatusEnum,
} from '@/constants'
import { BooleanField, EnumField, StringField } from '@/shared/decorators'

export class ImportCreateUserDto {
  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly lastName: string

  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly firstName: string

  @EnumField(() => RoleEnum)
  readonly role: RoleEnum

  @EnumField(() => UserStatusEnum)
  readonly status: UserStatusEnum

  @EnumField(() => UserLockedEnum)
  readonly isLocked: UserLockedEnum

  @BooleanField()
  isDeleted: boolean
}
