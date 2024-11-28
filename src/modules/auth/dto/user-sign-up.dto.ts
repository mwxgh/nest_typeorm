import { User } from '@/modules/user/entities/user.entity'
import { EmailField, PasswordField, StringField } from '@/shared/decorators'

export class UserSignUpDto {
  public static readonly entity = User.name

  @StringField({ maxLength: 20 })
  readonly username: string

  @PasswordField({ maxLength: 20 })
  readonly password: string

  @EmailField()
  readonly email: string

  @StringField({ maxLength: 20 })
  readonly firstName: string

  @StringField({ maxLength: 20 })
  readonly lastName: string
}
