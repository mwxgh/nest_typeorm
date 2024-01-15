import { User } from '@/modules/user/entities/user.entity'
import { StringField } from '@/shared/decorators'

export class UserSignUpDto {
  public static readonly entity = User.name

  @StringField()
  readonly username: string

  @StringField()
  readonly password: string

  @StringField()
  readonly email: string

  @StringField()
  readonly firstName: string

  @StringField()
  readonly lastName: string
}
