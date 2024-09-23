import { User } from '@/modules/user/entities/user.entity'
import { PasswordField, StringField } from '@/shared/decorators'

export class UserSignUpDto {
  public static readonly entity = User.name

  @StringField({ maxLength: 20 })
  readonly username: string

  @PasswordField({ maxLength: 20 })
  readonly password: string

  @StringField()
  readonly email: string

  @StringField()
  readonly firstName: string

  @StringField()
  readonly lastName: string
}
