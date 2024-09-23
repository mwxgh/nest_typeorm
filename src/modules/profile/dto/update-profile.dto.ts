import { EntityConstant } from '@/constants'
import { PasswordFieldOptional, StringFieldOptional } from '@/shared/decorators'

export class UpdateProfileDto {
  @StringFieldOptional({ maxLength: EntityConstant.EntityUserNameLength })
  readonly lastName: string

  @StringFieldOptional({ maxLength: EntityConstant.EntityUserNameLength })
  readonly firstName: string

  @StringFieldOptional({ maxLength: EntityConstant.EntityUserNameLength })
  readonly username: string

  @StringFieldOptional({ maxLength: EntityConstant.EntityShortLength })
  readonly email: string

  @PasswordFieldOptional({ maxLength: 20 })
  readonly password: string
}
